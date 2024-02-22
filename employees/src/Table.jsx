import PropTypes from "prop-types";
import './Table.css';


function Table ({objectOfPairProjects}) {

    // if (!objectOfPairProjects || !objectOfPairProjects.projects) {
    // return null;
    // }
    return (
        <>      
        {objectOfPairProjects ? (      
            <table>
                <thead>
                    <tr>
                        <th>Employee ID #1</th>
                        <th>Employee ID #2</th>
                        <th>Project ID</th>
                        <th>Days worked</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(objectOfPairProjects.projects).map(project => (
                    <tr key={project[0]}>
                        <td>{objectOfPairProjects.employee1}</td>
                        <td>{objectOfPairProjects.employee2}</td>
                        <td>{project[0]}</td>
                        <td>{project[1]}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            ) : (
                <h2>There are no pair of employees, who have worked on common projects at the same period of time!</h2>
            )}          
        </>
        
    );
}

export default Table;

Table.propTypes = {
    objectOfPairProjects: PropTypes.object,
  }