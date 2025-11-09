import React, { useMemo, useState, useEffect, useRef } from 'react';
import sampleData from '../data/feedback-data.json';

const FacultyDashboard = ({ user = {}, onLogout }) => {
  const coursesData = sampleData?.courses || {};
  const [selectedCourse, setSelectedCourse] = useState('');

  // faculty profile state (persisted locally per faculty user)
  const FAC_BASE_KEY = 'sfs_faculty_profile';
  const FAC_STORAGE_KEY = `${FAC_BASE_KEY}_${(user && (user.id || user.email)) ? String(user.id || user.email).replace(/[^a-zA-Z0-9_-]/g, '') : 'guest'}`;
  const [profile, setProfile] = useState(() => ({ name: user.name || '', email: user.email || '', department: '' }));
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const ASSIGN_BASE_KEY = 'sfs_faculty_assigned';
  const ASSIGN_STORAGE_KEY = `${ASSIGN_BASE_KEY}_${(user && (user.id || user.email)) ? String(user.id || user.email).replace(/[^a-zA-Z0-9_-]/g, '') : 'guest'}`;
  const [assignedCourses, setAssignedCourses] = useState(() => new Set());
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const SIZE_STORAGE_KEY = `${ASSIGN_STORAGE_KEY}_sizes`;
  const [courseSizes, setCourseSizes] = useState(() => ({}));
  const dropdownRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAC_STORAGE_KEY) || localStorage.getItem(FAC_BASE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setProfile(prev => ({ ...prev, ...saved }));
      }
    } catch (e) {
      // ignore
    }
  }, [FAC_STORAGE_KEY]);

  // load assigned courses for faculty (persisted selection)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ASSIGN_STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw || '[]') || [];
        setAssignedCourses(new Set(arr));
      }
    } catch (e) {}
  }, [ASSIGN_STORAGE_KEY]);

  useEffect(() => {
    try {
      localStorage.setItem(FAC_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {}
  }, [profile, FAC_STORAGE_KEY]);

  useEffect(() => {
    try {
      const arr = Array.from(assignedCourses || []);
      localStorage.setItem(ASSIGN_STORAGE_KEY, JSON.stringify(arr));
    } catch (e) {}
  }, [assignedCourses, ASSIGN_STORAGE_KEY]);

  // load/save course sizes (section student counts)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIZE_STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw || '{}') || {};
        setCourseSizes(obj);
      }
    } catch (e) {}
  }, [SIZE_STORAGE_KEY]);

  useEffect(() => {
    try {
      localStorage.setItem(SIZE_STORAGE_KEY, JSON.stringify(courseSizes || {}));
    } catch (e) {}
  }, [courseSizes, SIZE_STORAGE_KEY]);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    if (showProfileDropdown) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [showProfileDropdown]);

  const getInitials = (name) => {
    if (!name) return null;
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const pendingFormsList = sampleData?.pendingForms || [];
  const completedFormsList = sampleData?.completedForms || [];

  // compute full course summaries from coursesData
  const { overallAvg, totalResponses, courseSummaries } = useMemo(() => {
    const names = Object.keys(coursesData);
    let totalResp = 0;
    const summaries = names.map(name => {
      const items = coursesData[name] || [];
      const questions = items.length;
      const responses = items.reduce((a, q) => a + (q.responses?.length || 0), 0);
      totalResp += responses;
      const avg = questions ? items.reduce((a, q) => a + (Number(q.average) || 0), 0) / questions : 0;
      return { name, questions, responses, avg };
    });
    const overallAvg = summaries.length ? summaries.reduce((a, s) => a + s.avg, 0) / summaries.length : 0;
    return { overallAvg, totalResponses: totalResp, courseSummaries: summaries };
  }, [coursesData]);

  // determine which course names are taught by the logged-in faculty (scan pending/completed forms by instructor)
  // improved matching: normalize names by removing common titles and compare substrings
  const normalizeName = (n) => {
    if (!n) return '';
    return String(n).replace(/\b(dr|prof|professor|dr\.|prof\.)\b/gi, '').replace(/[\.,]/g, '').trim().toLowerCase();
  };

  const facultyCourseNames = useMemo(() => {
    const set = new Set();
    const uname = normalizeName(user?.name || '');
    // split tokens for token-level matching (helps when names differ in order or include initials)
    const userTokens = (uname || '').split(/\s+/).filter(Boolean);
    const pushIfMatch = (form) => {
      if (!form || !form.instructor) return;
      const instr = normalizeName(form.instructor);
      if (!instr) return;
      // direct substring match
      let isMatch = uname && (instr.includes(uname) || uname.includes(instr));
      // token overlap (e.g., surname only) or any token matches
      if (!isMatch) {
        const instrTokens = instr.split(/\s+/).filter(Boolean);
        isMatch = userTokens.some(ut => ut.length > 1 && instrTokens.some(it => it === ut || it.includes(ut) || ut.includes(it)));
      }
      if (isMatch) {
        const base = String(form.title || form.course || '').split(' - ')[0].trim();
        if (base) set.add(base);
      }
    };
    (pendingFormsList || []).forEach(pushIfMatch);
    (completedFormsList || []).forEach(pushIfMatch);
    return set;
  }, [pendingFormsList, completedFormsList, user]);

  // filter course summaries to only those taught by the faculty
  const filteredCourseSummaries = useMemo(() => {
    // union of auto-matched names and any manually assigned courses
    const displaySet = new Set([...(facultyCourseNames || []), ...Array.from(assignedCourses || [])]);
    if (!displaySet || displaySet.size === 0) return [];
    return courseSummaries.filter(s => displaySet.has(s.name));
  }, [courseSummaries, facultyCourseNames]);
  // always show only the faculty's matched courses (no claiming/toggles)

  // aggregated stats for filtered courses
  const filteredStats = useMemo(() => {
    if (!filteredCourseSummaries || filteredCourseSummaries.length === 0) return { overallAvg: 0, totalResponses: 0, courseCount: 0 };
    const overallAvg = filteredCourseSummaries.reduce((a, s) => a + s.avg, 0) / filteredCourseSummaries.length;
    const totalResponses = filteredCourseSummaries.reduce((a, s) => a + s.responses, 0);
    return { overallAvg, totalResponses, courseCount: filteredCourseSummaries.length };
  }, [filteredCourseSummaries]);

  const displayedStats = useMemo(() => {
    const list = filteredCourseSummaries || [];
    if (list.length === 0) return { overallAvg: 0, totalResponses: 0, courseCount: 0 };
    const overallAvg = list.reduce((a, s) => a + s.avg, 0) / list.length;
    const totalResponses = list.reduce((a, s) => a + s.responses, 0);
    return { overallAvg, totalResponses, courseCount: list.length };
  }, [filteredCourseSummaries]);

  const aggregatedStudentStats = useMemo(() => {
    const list = filteredCourseSummaries || [];
    let totalStudents = 0;
    let totalFilled = 0;
    list.forEach(s => {
      const size = Number(courseSizes[s.name]) || 0;
      const filled = getRespondedCount(s.name) || 0;
      totalStudents += size;
      totalFilled += filled;
    });
    const totalPending = Math.max(0, totalStudents - totalFilled);
    const completion = totalStudents > 0 ? Math.round((totalFilled / totalStudents) * 100) : 0;
    return { totalStudents, totalFilled, totalPending, completion };
  }, [filteredCourseSummaries, courseSizes]);

  const viewFeedback = (course) => {
    setSelectedCourse(course === selectedCourse ? '' : course);
  };

  const addAssignedCourse = (name) => {
    setAssignedCourses(prev => {
      const next = new Set(prev || []);
      next.add(name);
      return next;
    });
  };

  const removeAssignedCourse = (name) => {
    setAssignedCourses(prev => {
      const next = new Set(prev || []);
      next.delete(name);
      return next;
    });
  };

  const getCandidateCourses = () => {
    const allNames = (courseSummaries || []).map(s => s.name);
    const displaySet = new Set([...(facultyCourseNames || []), ...Array.from(assignedCourses || [])]);
    // candidates are those not already in displaySet
    return allNames.filter(n => !displaySet.has(n));
  };

  const setCourseSize = (name, size) => {
    setCourseSizes(prev => ({ ...(prev || {}), [name]: size }));
  };

  const getRespondedCount = (courseName) => {
    const items = coursesData[courseName] || [];
    if (!items || items.length === 0) return 0;
    // take the maximum responses length across questions as estimate of student respondents
    return Math.max(...items.map(q => (q.responses || []).length));
  };

  const findFormEntryForCourse = (courseName) => {
    // try to find a pending or completed form whose title base matches the courseName
    const findIn = (list) => {
      for (const f of (list || [])) {
        const base = String(f.title || f.course || '').split(' - ')[0].trim();
        if (base && base === courseName) return f;
      }
      return null;
    };
    return findIn(pendingFormsList) || findIn(completedFormsList) || null;
  };

  return (
    <div style={{padding: 24, fontFamily: 'Arial, Helvetica, sans-serif', background: '#fff', minHeight: '100vh', color: '#0b1220'}}>
      {/* Top Header */}
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
        <div>
          <h1 style={{margin: 0}}>Faculty Dashboard</h1>
          <div style={{color: '#6b7280', marginTop: 6}}>Welcome, {profile.name || user.name || 'Faculty'}</div>
        </div>
        <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
          <div style={{position: 'relative'}} ref={dropdownRef}>
            <button onClick={() => setShowProfileDropdown(s => !s)} style={{width: 40, height: 40, borderRadius: 20, border: 'none', background: '#eef2ff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}} title="Profile">
              <span style={{fontWeight: 700, color: '#0b1220', fontSize: 13}}>{getInitials(profile.name || user.name) || 'F'}</span>
            </button>

            {showProfileDropdown && (
              <div style={{position: 'absolute', right: 0, marginTop: 8, width: 320, background: '#fff', border: '1px solid #eef2f7', borderRadius: 8, boxShadow: '0 8px 24px rgba(2,6,23,0.08)', padding: 12, zIndex: 40}}>
                <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                  <div style={{width: 56, height: 56, borderRadius: 8, overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{fontWeight: 700, color: '#64748b'}}>{getInitials(profile.name || user.name) || 'F'}</div>
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 700}}>{profile.name || user.name}</div>
                    <div style={{fontSize: 13, color: '#475569'}}>{profile.email || user.email || 'No email'}</div>
                    <div style={{fontSize: 12, color: '#94a3b8', marginTop: 6}}>{profile.department || ''}</div>
                  </div>
                </div>

                <div style={{display: 'flex', gap: 8, marginTop: 12}}>
                  <button className="action-btn" onClick={() => { setShowProfileDropdown(false); setShowEditModal(true); }}>Edit Profile</button>
                  <button className="action-btn" onClick={() => { setShowProfileDropdown(false); onLogout && onLogout(); }} style={{marginLeft: 'auto'}}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Edit profile modal for faculty */}
      {showEditModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60}} onClick={() => setShowEditModal(false)}>
          <div style={{width: 420, background: '#fff', borderRadius: 10, padding: 16, boxShadow: '0 12px 40px rgba(2,6,23,0.16)'}} onClick={(e) => e.stopPropagation()}>
            <h3 style={{marginTop: 0}}>Edit Profile</h3>
            <div style={{display: 'grid', gap: 8}}>
              <label style={{fontSize: 13, fontWeight: 600}}>Full name</label>
              <input placeholder="Full name" value={profile.name} onChange={(e) => setProfile(p => ({...p, name: e.target.value}))} />
              <label style={{fontSize: 13, fontWeight: 600}}>Email</label>
              <input placeholder="you@university.edu" value={profile.email} onChange={(e) => setProfile(p => ({...p, email: e.target.value}))} />
              <label style={{fontSize: 13, fontWeight: 600}}>Department</label>
              <input placeholder="Department (optional)" value={profile.department} onChange={(e) => setProfile(p => ({...p, department: e.target.value}))} />
              <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8}}>
                <button className="action-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="action-btn" onClick={() => setShowEditModal(false)}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards - filtered to faculty's courses */}
      <section style={{display: 'flex', gap: 12, marginBottom: 20}}>
        <div style={{flex: 1, background: '#ffffff', border: '1px solid #eef2f7', padding: 12, borderRadius: 8}}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Average Rating</div>
          <div style={{fontSize: 24, fontWeight: 700}}>{(filteredStats.overallAvg || 0).toFixed(2)}/5</div>
        </div>
        <div style={{flex: 1, background: '#ffffff', border: '1px solid #eef2f7', padding: 12, borderRadius: 8}}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Responses</div>
          <div style={{fontSize: 24, fontWeight: 700}}>{filteredStats.totalResponses || 0}</div>
        </div>
        <div style={{flex: 1, background: '#ffffff', border: '1px solid #eef2f7', padding: 12, borderRadius: 8}}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Courses</div>
          <div style={{fontSize: 24, fontWeight: 700}}>{filteredStats.courseCount || 0}</div>
        </div>
      </section>

      {/* Student summary cards */}
      <section style={{display: 'flex', gap: 12, marginBottom: 20}}>
        <div style={{flex: 1, background: '#ffffff', border: '1px solid #eef2f7', padding: 12, borderRadius: 8}}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Students (sum of sections)</div>
          <div style={{fontSize: 24, fontWeight: 700}}>{aggregatedStudentStats.totalStudents || 0}</div>
        </div>
        <div style={{flex: 1, background: '#ffffff', border: '1px solid #eef2f7', padding: 12, borderRadius: 8}}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Filled</div>
          <div style={{fontSize: 24, fontWeight: 700}}>{aggregatedStudentStats.totalFilled || 0}</div>
        </div>
        <div style={{flex: 1, background: '#ffffff', border: '1px solid #eef2f7', padding: 12, borderRadius: 8}}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Pending</div>
          <div style={{fontSize: 24, fontWeight: 700}}>{aggregatedStudentStats.totalPending || 0}</div>
        </div>
        <div style={{flex: 1, background: '#ffffff', border: '1px solid #eef2f7', padding: 12, borderRadius: 8}}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Completion</div>
          <div style={{fontSize: 24, fontWeight: 700}}>{aggregatedStudentStats.completion || 0}%</div>
        </div>
      </section>

      {/* Course List Table */}
      <section style={{marginBottom: 20}}>
        <h2 style={{margin: '0 0 12px 0'}}>Course List</h2>
        {filteredCourseSummaries.length === 0 ? (
          <div style={{padding: 16, background: '#fff', border: '1px solid #eef2f7', borderRadius: 8, color: '#6b7280', display: 'flex', flexDirection: 'column', gap: 12}}>
            <div style={{fontWeight: 600}}>No courses assigned</div>
            <div>If you don’t see any courses yet, you’ll see feedback here once you’re linked to a class. Try one of the options below.</div>
            <div style={{display: 'flex', gap: 8, marginTop: 6}}>
              <button className="action-btn" onClick={() => { setShowEditModal(true); setShowProfileDropdown(false); }}>Edit profile</button>
              <button className="action-btn" onClick={() => setShowAssignPanel(true)} style={{marginLeft: 'auto'}}>Show possible matches</button>
            </div>
          </div>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{textAlign: 'left', borderBottom: '1px solid #eef2f7'}}>
                <th style={{padding: '10px 8px'}}>Course</th>
                <th style={{padding: '10px 8px'}}>Code / Section</th>
                <th style={{padding: '10px 8px'}}>Students</th>
                <th style={{padding: '10px 8px'}}>Filled</th>
                <th style={{padding: '10px 8px'}}>Pending</th>
                <th style={{padding: '10px 8px'}}>Completed</th>
                <th style={{padding: '10px 8px'}}>Avg Rating</th>
                <th style={{padding: '10px 8px'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourseSummaries.map(c => {
                const form = findFormEntryForCourse(c.name);
                const code = form?.course || '—';
                const responded = getRespondedCount(c.name) || 0;
                const size = courseSizes[c.name] || '';
                const pendingCount = (typeof size === 'number' && !Number.isNaN(size)) ? Math.max(0, size - responded) : '—';
                const percent = (typeof size === 'number' && size > 0) ? `${Math.round((responded / size) * 100)}%` : '—';
                return (
                  <tr key={c.name} style={{borderBottom: '1px solid #f8fafc'}}>
                    <td style={{padding: '12px 8px'}}>{c.name}</td>
                    <td style={{padding: '12px 8px'}}>{code}</td>
                    <td style={{padding: '12px 8px'}}>
                      <input type="number" min={0} value={size === '' ? '' : size} placeholder="set" onChange={(e) => {
                        const v = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value || '0', 10));
                        setCourseSize(c.name, v === '' ? '' : v);
                      }} style={{width: 80, padding: '6px', borderRadius: 6, border: '1px solid #e6eef6'}} />
                    </td>
                    <td style={{padding: '12px 8px'}}>{responded}</td>
                    <td style={{padding: '12px 8px'}}>{pendingCount}</td>
                    <td style={{padding: '12px 8px'}}>{percent}</td>
                    <td style={{padding: '12px 8px'}}>{c.avg.toFixed(2)}/5</td>
                    <td style={{padding: '12px 8px'}}>
                      <button onClick={() => viewFeedback(c.name)} style={{padding: '8px 12px', borderRadius: 6, background: '#0ea5e9', color: '#fff', border: 'none'}}>View Feedback</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Rating Analysis Chart */}
      <section style={{marginBottom: 20}}>
        <h2 style={{margin: '0 0 12px 0'}}>Rating Analysis</h2>
        <div style={{background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #eef2f7'}}>
          {filteredCourseSummaries.length === 0 ? (
            <div style={{color: '#6b7280'}}>No rating data available for your courses.</div>
          ) : (
            <svg width="100%" height={filteredCourseSummaries.length * 36} viewBox={`0 0 600 ${filteredCourseSummaries.length * 36}`} preserveAspectRatio="xMinYMin meet">
              {filteredCourseSummaries.map((c, i) => {
                const barWidth = Math.max(2, (c.avg / 5) * 500);
                return (
                  <g key={c.name} transform={`translate(0, ${i * 36})`}>
                    <text x={0} y={16} style={{fontSize: 12, fill: '#0b1220'}}>{c.name}</text>
                    <rect x={120} y={4} width={barWidth} height={12} rx={6} fill="#0ea5e9" />
                    <text x={120 + barWidth + 8} y={16} style={{fontSize: 12, fill: '#0b1220'}}>{c.avg.toFixed(2)}/5</text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </section>

      {/* Selected course feedback modal */}
      {selectedCourse && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80}} onClick={() => setSelectedCourse('')}>
          <div style={{width: 'min(900px, 96%)', maxHeight: '86vh', overflowY: 'auto', background: '#fff', borderRadius: 10, padding: 18, boxShadow: '0 20px 60px rgba(2,6,23,0.18)'}} onClick={(e) => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3 style={{margin: 0}}>Feedback — {selectedCourse}</h3>
              <button onClick={() => setSelectedCourse('')} style={{border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer'}}>✕</button>
            </div>

            <div style={{marginTop: 12}}>
              {(coursesData[selectedCourse] || []).map((q, idx) => (
                <div key={idx} style={{marginBottom: 12}}>
                  <div style={{fontWeight: 700}}>{q.question} — Avg: {q.average}/5</div>
                  <div style={{marginTop: 8}}>
                    {(q.responses || []).map((r, i) => (
                      <div key={i} style={{padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid #f1f5f9'}}>{r}</div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{marginTop: 12}}>
                <div style={{fontWeight: 700, marginBottom: 8}}>All comments</div>
                {((coursesData[selectedCourse] || []).flatMap(q => q.responses || [])).length === 0 ? (
                  <div style={{color: '#6b7280'}}>No comments available for this course.</div>
                ) : (
                  (coursesData[selectedCourse] || []).flatMap(q => q.responses || []).map((c, i) => (
                    <div key={i} style={{padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #f1f5f9'}}>{c}</div>
                  ))
                )}
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 16}}>
                <button onClick={() => setSelectedCourse('')} style={{padding: '8px 14px', borderRadius: 6}}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign / Possible matches modal */}
      {showAssignPanel && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80}} onClick={() => setShowAssignPanel(false)}>
          <div style={{width: 'min(760px, 96%)', maxHeight: '80vh', overflowY: 'auto', background: '#fff', borderRadius: 10, padding: 18, boxShadow: '0 20px 60px rgba(2,6,23,0.18)'}} onClick={(e) => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3 style={{margin: 0}}>Possible course matches</h3>
              <button onClick={() => setShowAssignPanel(false)} style={{border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer'}}>✕</button>
            </div>

            <div style={{marginTop: 12}}>
              <div style={{fontWeight: 700, marginBottom: 8}}>Candidate courses</div>
              {getCandidateCourses().length === 0 ? (
                <div style={{color: '#6b7280'}}>No additional candidate courses found.</div>
              ) : (
                getCandidateCourses().map((c, i) => (
                  <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid #f1f5f9'}}>
                    <div>{c}</div>
                    <div style={{display: 'flex', gap: 8}}>
                      <button className="action-btn" onClick={() => addAssignedCourse(c)}>Include</button>
                    </div>
                  </div>
                ))
              )}

              <div style={{marginTop: 12}}>
                <div style={{fontWeight: 700, marginBottom: 8}}>Manually assigned</div>
                {Array.from(assignedCourses || []).length === 0 ? (
                  <div style={{color: '#6b7280'}}>No courses assigned manually.</div>
                ) : (
                  Array.from(assignedCourses || []).map((c, i) => (
                    <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid #f1f5f9'}}>
                      <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                        <div>{c}</div>
                        <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
                          <div style={{fontSize: 12, color: '#6b7280'}}>Students:</div>
                          <input type="number" min={0} value={courseSizes[c] === undefined ? '' : courseSizes[c]} placeholder="set" onChange={(e) => {
                            const v = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value || '0', 10));
                            setCourseSize(c, v === '' ? '' : v);
                          }} style={{width: 80, padding: '6px', borderRadius: 6, border: '1px solid #e6eef6'}} />
                        </div>
                      </div>
                      <div>
                        <button className="action-btn" onClick={() => removeAssignedCourse(c)}>Remove</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 16}}>
                <button onClick={() => setShowAssignPanel(false)} style={{padding: '8px 14px', borderRadius: 6}}>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;