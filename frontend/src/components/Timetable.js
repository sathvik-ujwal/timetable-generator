import React, { useState } from "react";

export default function Timetable() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["Period 1", "Period 2", "Period 3", "Period 4", "Period 5"];
  const courses = [
    "Algorithms",
    "Artificial Intelligence",
    "Operating systems",
    "Maths",
    "Database Systems",
  ];
  const teachers = [
    "Jagdesh Sharma",
    "Ms Rupali Kotian",
    "Dr jayashankar",
    "Mr Anupam",
    "Ms Archana",
  ];
  const sections = [
    "Section 1",
    "Section 2",
    "Section 3",
    "Section 4",
    //"section 5",
  ];

  const [timetabledata, setTimetabledata] = useState({});
  const [conflictCount, setConflictCount] = useState(0);

  function generateRandomTimetable() {
    const teacherCourseAssignment = assignTeachersToCourses();
    const timetable = {};

    for (const day of days) {
      for (const period of periods) {
        for (const section of sections) {
          const course = getRandomElement(courses);
          const teacher = teacherCourseAssignment[course];
          const key = `${day}-${period}-${section}`;
          timetable[key] = [course, teacher];
        }
      }
    }
    return timetable;
  }

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function assignTeachersToCourses() {
    const teacherCourseAssignment = {};
    const remainingTeachers = [...teachers];
    for (const course of courses) {
      const teacherIndex = Math.floor(Math.random() * remainingTeachers.length);
      const assignedTeacher = remainingTeachers.splice(teacherIndex, 1)[0];
      teacherCourseAssignment[course] = assignedTeacher;
    }
    return teacherCourseAssignment;
  }

  function calculateScore(timetable) {
    let conflicts = 0;
    for (const day of days) {
      for (const period of periods) {
        const coursesAssigned = [];
        const teachersAssigned = [];
        for (const section of sections) {
          const [course, teacher] = timetable[`${day}-${period}-${section}`];
          if (
            coursesAssigned.includes(course) ||
            teachersAssigned.includes(teacher)
          ) {
            conflicts++;
          }
          coursesAssigned.push(course);
          teachersAssigned.push(teacher);
        }
      }
    }
    console.log(conflicts);
    setConflictCount(conflicts);
    return conflicts;
  }

  function hillClimbing(timetable) {
    let currentScore = calculateScore(timetable);

    while (true) {
      const neighbors = [];
      for (let i = 0; i < 100; i++) {
        const neighborTimetable = { ...timetable };
        const day = getRandomElement(days);
        const period = getRandomElement(periods);
        const section = getRandomElement(sections);
        const assignedTeacher = timetable[`${day}-${period}-${section}`][1];
        const course = getRandomElement(courses);
        neighborTimetable[`${day}-${period}-${section}`] = [
          course,
          assignedTeacher,
        ];
        neighbors.push([neighborTimetable, calculateScore(neighborTimetable)]);
      }

      const bestNeighbor = neighbors.reduce(
        (minNeighbor, neighbor) =>
          neighbor[1] < minNeighbor[1] ? neighbor : minNeighbor,
        neighbors[0]
      );

      if (bestNeighbor[1] >= currentScore) {
        break;
      } else {
        timetable = bestNeighbor[0];
        currentScore = bestNeighbor[1];
      }
    }
    setTimetabledata(timetable);
    return timetable;
  }

  function combinedAlgorithm(
    initialTimetable,
    maxIterations,
    initialTemperature,
    coolingRate
  ) {
    let currentTimetable = initialTimetable;
    let currentScore = calculateScore(currentTimetable);
    let bestTimetable = initialTimetable;
    let bestScore = currentScore;
    let temperature = initialTemperature;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      const newTimetable = hillClimbing(currentTimetable);
      const newScore = calculateScore(newTimetable);
      const deltaScore = newScore - currentScore;
      if (
        deltaScore < 0 ||
        Math.random() < Math.exp(-deltaScore / temperature)
      ) {
        currentTimetable = newTimetable;
        currentScore = newScore;
        if (currentScore < bestScore) {
          bestTimetable = currentTimetable;
          bestScore = currentScore;
        }
      }
      temperature *= coolingRate;
    }

    setTimetabledata(bestTimetable);
    return bestTimetable;
  }

  const periodTimings = {
    "Period 1": "9:00 - 10:00",
    "Period 2": "10:00 - 11:00",
    "Period 3": "11:00 - 12:00",
    "B R E A K": "12:00 - 1:00",
    "Period 4": "1:00 - 2:00",
    "Period 5": "2:00 - 3:00",
  };

  return (
    <>
      <div>
        <button
          type="button"
          className="btn btn-dark mb-3"
          onClick={
            () => combinedAlgorithm(generateRandomTimetable(), 100, 100, 0.95)
            //hillClimbing(timetable)
          }
          style={{
            marginLeft: "431px",
            marginTop: "30px",
            width: "250px",
            height: "50px",
            fontSize: "20px",
          }}
        >
          Generate Timetable
        </button>
      </div>

      {sections.map((section, index) => (
        <div className="container" key={index}>
          <h2>Section {index + 1}</h2>
          <table
            className="table table-bordered"
            style={{ borderRadius: "5px" }}
          >
            <thead>
              <tr class="table-danger">
                <th scope="col">Periods</th>
                {days.map((day, idx) => (
                  <th key={idx} scope="col">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, idx) => (
                <>
                  <tr key={idx} className="table-info">
                    <th scope="row">
                      {period} <br /> {periodTimings[period]}
                    </th>
                    {days.map((day, dayIdx) => (
                      <td key={dayIdx}>
                        {timetabledata[`${day}-${period}-${section}`]
                          ? timetabledata[`${day}-${period}-${section}`][0]
                          : ""}
                        <br />
                        {timetabledata[`${day}-${period}-${section}`]
                          ? timetabledata[`${day}-${period}-${section}`][1]
                          : ""}
                      </td>
                    ))}
                  </tr>
                  {idx === 2 && (
                    <tr key="break-row" className="table-info">
                      <th scope="row">BREAK</th>
                      {days.map((_, dayIdx) => (
                        <td key={`break-cell-${dayIdx}`}>{}</td>
                      ))}
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}
