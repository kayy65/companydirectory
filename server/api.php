<?php

header('Content-Type: application/json'); 
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$servername = "localhost";
$username = "webdev";
$password = "123456";
$dbname = "companydirectory";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit; // Exit if the connection fails
}


function fetchPersonnelData($id = null, $searchTerm = null) {
    global $conn; // Use the global $conn variable

    try {
        // Base SQL query to fetch personnel data with department and location info
        $sql = "
            SELECT 
                personnel.id,
                personnel.firstName,
                personnel.lastName,
                personnel.email,
                personnel.jobTitle,
                personnel.departmentID as department_id,
                department.name as department_name, 
                department.locationID as department_location_id, 
                location.id as location_id, 
                location.name as location_name 
            FROM personnel
            JOIN department ON personnel.departmentID = department.id
            JOIN location ON department.locationID = location.ID
        ";

        // Determine which condition to use (by ID or search term)
        if ($id !== null) {
            $sql .= " WHERE personnel.id = :id"; // Filter by ID
        } elseif ($searchTerm !== null) {
            $sql .= " WHERE personnel.firstName LIKE :searchTerm OR personnel.lastName LIKE :searchTerm"; // Filter by search term
        }

        $sql .= " ORDER BY personnel.id DESC"; 

        // Prepare the statement
        $stmt = $conn->prepare($sql);

        // Bind parameters to the SQL query
        if ($id !== null) {
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        } elseif ($searchTerm !== null) {
            $stmt->bindValue(':searchTerm', '%' . $searchTerm . '%', PDO::PARAM_STR);
        }

        // Execute the statement
        $stmt->execute();

        // Fetch all data
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result; // Return the result
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}


function fetchAllDepartsmentData($searchTerm=null){
    global $conn; 
    try {

      $sql = "
 SELECT 
    department.id,
    department.name AS department_name, 
    department.locationID AS department_location_id, 
    location.id AS location_id, 
    location.name AS location_name 
FROM department
JOIN location ON department.locationID = location.id
GROUP BY department.id, department_name;

"; 

$sql .= "WHERE department.name LIKE :searchTerm"; 
$stmt = $conn->prepare($sql);

  if ($searchTerm) {
            $stmt->bindValue(':searchTerm', '%' . $searchTerm . '%', PDO::PARAM_STR);
        }
        $stmt->execute(); // Execute the statement
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC); // Fetch all data
        return $result; // Return the result
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}






function deletePersonnelRecord($id) {
    global $conn; 
    try {
        // Prepare the SQL statement with a parameter placeholder
        $stmt = $conn->prepare("DELETE FROM personnel WHERE id = :id");

        // Bind the parameter to the statement
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        // Execute the statement
        $stmt->execute();

        // Optionally, return a success message or boolean
        return true; // or return $stmt->rowCount() to check the number of affected rows
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        return false; // Return false in case of error
    }
}





function deleteDepartmentRecord($id) {
    global $conn; 
    try {
        // Prepare the SQL statement with a parameter placeholder
        $stmt = $conn->prepare("DELETE FROM department WHERE id = :id");

        // Bind the parameter to the statement
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        if($stmt->execute()){
            return true; 
        }else{
            return false; 
        }

        // Optionally, return a success message or boolean
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        return false; // Return false in case of error
    }
}





function deleteLocationRecord($id) {
    global $conn; 
    try {
        // Prepare the SQL statement with a parameter placeholder
        $stmt = $conn->prepare("DELETE FROM location WHERE id = :id");

        // Bind the parameter to the statement
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        if($stmt->execute()){
            return true; 
        }else{
            return false; 
        }

        // Optionally, return a success message or boolean
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        return false; // Return false in case of error
    }
}

function fetchAllLocationsData(){
    global $conn; 
    try {
$stmt = $conn->prepare("
 SELECT 
 location.id as location_id, 
 location.name as location_name
FROM location
");
        $stmt->execute(); // Execute the statement
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC); // Fetch all data
        return $result; // Return the result
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}




function fetchAllDepartmentsAndLocations(){

    $departments = fetchAllDepartsmentData(); 
    $locations = fetchAllLocationsData();

    $result =[]; 
    $result['departments'] = $departments; 
    $result['lcations'] = $locations; 

    return $result; 
}






function createPersonnel($data){


  try {
    //code...


  global $conn; 
   $firstName = $data['firstName'];
  $lastName = $data['lastName'];
  $jobTitle = $data['jobTitle'];
  $email = $data['email'];
  $department = $data['department'];

  $stmt = $conn->prepare("INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES (:firstName, :lastName, :jobTitle, :email, :department)");


  $stmt->bindParam(':firstName', $firstName);
  $stmt->bindParam(':lastName', $lastName);
  $stmt->bindParam(':jobTitle', $jobTitle);
  $stmt->bindParam(':email', $email);
  $stmt->bindParam(':department', $department);


    // Execute the SQL statement
        $stmt->execute(); 





  } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();

  }

  

}



function editPersonnel($id, $data) {
    global $conn; // Use the global $conn variable

    try {
        // Extract data from the array
        $firstName = $data['firstName'];
        $lastName = $data['lastName'];
        $jobTitle = $data['jobTitle'];
        $email = $data['email'];
        $department = $data['department'];


       




        // Prepare the SQL UPDATE statement
        $stmt = $conn->prepare("UPDATE personnel 
                                SET firstName = :firstName, 
                                    lastName = :lastName, 
                                    jobTitle = :jobTitle, 
                                    email = :email, 
                                    departmentID = :department 
                                WHERE id = :id");

        // Bind parameters to the SQL query
        $stmt->bindParam(':firstName', $firstName);
        $stmt->bindParam(':lastName', $lastName);
        $stmt->bindParam(':jobTitle', $jobTitle);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':department', $department);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT); // Bind the ID parameter

        // Execute the SQL statement
        $stmt->execute(); 
    } catch (PDOException $e) {
    error_log("SQL Error: " . $e->getMessage());
    echo "Error: " . $e->getMessage(); // Error handling
}

}







function editDepartment($id, $data) {
    global $conn; // Use the global $conn variable

    try {
        // Extract data from the array
        $departmentName = $data['departmentName'];
        $departmentLocation = $data['departmentLocation'];
        $departmentID = $id; 


       




        // Prepare the SQL UPDATE statement
        $stmt = $conn->prepare("UPDATE department 
                                SET name = :departmentName, 
                                    locationID = :departmentLocation 
                                WHERE id = :id");

        // Bind parameters to the SQL query
        $stmt->bindParam(':departmentName', $departmentName);
        $stmt->bindParam(':departmentLocation', $departmentLocation);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT); // Bind the ID parameter

        // Execute the SQL statement

        if($stmt->execute()){
            return ['success'=>true];  
        }
    } catch (PDOException $e) {
    error_log("SQL Error: " . $e->getMessage());
    echo "Error: " . $e->getMessage(); // Error handling
}

}







function editLocation($id, $data) {
    global $conn; // Use the global $conn variable

    try {
        // Extract data from the array
        $locationName = $data['locationName'];


       




        // Prepare the SQL UPDATE statement
        $stmt = $conn->prepare("UPDATE location 
                                SET name = :locationName
                                WHERE id = :id");

        // Bind parameters to the SQL query
        $stmt->bindParam(':locationName', $locationName);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT); // Bind the ID parameter

        // Execute the SQL statement

        if($stmt->execute()){
            return ['success'=>true];  
        }
    } catch (PDOException $e) {
    error_log("SQL Error: " . $e->getMessage());
    echo "Error: " . $e->getMessage(); // Error handling
}

}






// Handle GET requests 
if (isset($_GET['action'])) {
    $action = $_GET['action'];
    $searchTerm = $_GET['searchTerm'] ?? null; // Use null if not set
    $id = $_GET['id'] ?? null; // Use null if not set


   
    switch ($action) {
    case 'fetchAllPersonnelData':
        if ($id !== null) {
            $result = [
                'personnel' => fetchPersonnelData($id),
                'department' => fetchAllDepartsmentData()
            ];
            // Fetch personnel by ID
            echo json_encode($result);
        } elseif ($searchTerm !== null) {
            // Fetch personnel by search term
            echo json_encode(fetchPersonnelData(null, $searchTerm));
        } else {
            // Fetch all personnel data
            echo json_encode(fetchPersonnelData());
        }
        break;

    case 'fetchAllDepartsmentData':
        if ($searchTerm !== null) {
            echo json_encode(fetchAllDepartsmentData($searchTerm));
        } else {
            echo json_encode(fetchAllDepartsmentData());
        }
        break;

    case 'fetchAllLocationsData':
        echo json_encode(fetchAllLocationsData());
        break;

    case 'fetchAllDepartmentsAndLocations': 
        echo json_encode(fetchAllDepartmentsAndLocations()); 
        break; 

  
  

    // Default case for handling invalid actions
    default:
        echo json_encode(['error' => 'Invalid action specified.']);
        break;
}

}

// handle post requests 

if (isset($_POST['action'])){
  $action = $_POST['action']; 
  


  switch ($action) {
    case 'createPersonnel':
      echo json_encode(createPersonnel($_POST)); 

      break;

    case 'getPersonnelByID':
      $id = $_POST['id'];
      echo json_encode(getPersonnelByID($id));

    case 'editPersonnel':
      $id = $_POST['personnelID']; 

      echo json_encode(editPersonnel($id, $_POST));
      break; 

    

    case 'deletePersonnelRecord':
        $id = $_POST['personnelID'];
        echo json_encode(deletePersonnelRecord($id));
        break;

      case 'editDepartment': 
        $id = $_POST['departmentID']; 
        echo json_encode(editDepartment($id, $_POST)); 
        break; 


    case 'deleteDepartmentRecord':

        $id = $_POST['departmentID']; 
        echo json_encode(deleteDepartmentRecord($id)); 
        break; 
               
    case 'editLocation': 
        $id = $_POST['id']; 
        echo json_encode(editLocation($id, $_POST));

        break; 
    

    case "deleteLocation":
        $id = $_POST['id']; 
        echo json_encode(deleteLocationRecord($id)); 
        break; 
    // Default case for handling invalid actions
    default:
        echo json_encode(['error' => 'Invalid action specified.']);
        break;
  }

  


  // insert data to the database 
  


}

?>
