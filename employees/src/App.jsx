import { useState } from 'react'
import './App.css';
import Table from './Table';

function App() {

  let [longestWorkingPair, setLongestWorkingPair] = useState();

  const [isCalculated, setIsCalculated] = useState(false);

  const onReadFile = (event) => {

    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = () => {
      const inputFromFile = reader.result.trim().split('\r\n');
      const employees = [];

      for(let i=0; i<inputFromFile.length; i++){
        const employee = inputFromFile[i].trim().split(', ');
        const employeeNumber = employee[0];
        
        const indexOfEmployeeInArray = employees.findIndex(el => el.employeeID === employeeNumber);
        if(indexOfEmployeeInArray > -1){
          employees[indexOfEmployeeInArray].projects[employee[1]]={ dateFrom: employee[2], dateTo: employee[3]};
        }else{
          employees.push({employeeID: employeeNumber, projects: {[employee[1]]: {dateFrom: employee[2], dateTo: employee[3]}}});
        }
      }

      const employeesWithCommonProjects = [];

      for(let i=0; i<employees.length; i++){
        for(let j=i+1; j<employees.length; j++){
          for(const key in employees[j].projects){
            if(employees[i].projects.hasOwnProperty(key)){
              if(employees[i].projects[key].dateFrom<=employees[j].projects[key].dateTo && employees[i].projects[key].dateTo>=employees[j].projects[key].dateFrom){
                
                let maxStart;
                let minEnd;
                if(new Date(employees[i].projects[key].dateFrom) > new Date(employees[j].projects[key].dateFrom)){
                  maxStart = new Date(employees[i].projects[key].dateFrom);
                }else{
                  maxStart = new Date(employees[j].projects[key].dateFrom);
                }

                if(employees[i].projects[key].dateTo < employees[j].projects[key].dateTo){
                  minEnd = employees[i].projects[key].dateTo;
                }else{
                  minEnd = employees[j].projects[key].dateTo;
                }
                
                const commonDaysWork = Math.round(new Date(minEnd)-new Date(maxStart))/ (1000 * 3600 * 24) + 1;

                const indexOfEmployeesWithCommonProjects = employeesWithCommonProjects.findIndex(el => Object.values(el).includes(employees[i].employeeID) && Object.values(el).includes(employees[j].employeeID));
                if(indexOfEmployeesWithCommonProjects > -1){
                  employeesWithCommonProjects[indexOfEmployeesWithCommonProjects].projects[key]= commonDaysWork;
                }else{
                  employeesWithCommonProjects.push({employee1: employees[i].employeeID, employee2: employees[j].employeeID, projects: {[key]: commonDaysWork}});
                }
              }
            }
          }
        }
      }

      let indexOfLongestWorkingPair;
      let maxWorkingDays = 0;

      for(let i=0; i<employeesWithCommonProjects.length; i++){
        const commonProjects = Object.values(employeesWithCommonProjects[i].projects);
        const sum = commonProjects.reduce((el, acc) => acc += el, 0);
        if(sum > maxWorkingDays){
          maxWorkingDays = sum;
          indexOfLongestWorkingPair = i;
        }
      }

      setLongestWorkingPair(employeesWithCommonProjects[indexOfLongestWorkingPair]);
      setIsCalculated(true);
    };


    reader.onerror = () => {
      console.log(reader.error);
    };
  
  }

  return (
    <>
      <div className="card">
        <h1>Pair of employees who have worked together on common projects for the longest period of time</h1>
        {!isCalculated ? (
          <>
            <h2>Upload a .csv file with employee data in the following format:  
            EmpID, ProjectID, DateFrom, DateTo, to find out which two employees have worked the longest period of time on common projects. </h2>
            <input type='file' accept=".csv" onChange={onReadFile}></input>
          </>
        ) : (
          <Table objectOfPairProjects={longestWorkingPair}></Table>
        )}
        
      </div>
    </>
  )
}

export default App;
