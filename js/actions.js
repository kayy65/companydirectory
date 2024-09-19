$("#searchInp").on("keyup", function (e) {
  let phrase = e.target.value;
  console.log({ phrase })
  
 
  fetchAllPersonnelData(phrase)
  fetchAllDepartsmentData(phrase)

  fetchAllLocationsData(phrase)

  
  // your code
  
});

$("#refreshBtn").click(function () {
  // when the refresh button is clicked, clear the search term 

  $("#searchInp").val("")
  
  if ($("#personnelBtn").hasClass("active")) {
    
    // Refresh personnel table

fetchAllPersonnelData()

    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
      
      // Refresh department table

      

fetchAllDepartsmentData()
      
    } else {
      
      // Refresh location table

fetchAllLocationsData()

      
    }
    
  }
  
});

$("#filterBtn").click(function () {
  
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  
});

$("#addBtn").click(function () {
  
  // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
  
});

$("#personnelBtn").click(function () {
  
  // Call function to refresh personnel table


  fetchAllPersonnelData()
  
  
});

$("#departmentsBtn").click(function () {
  
  // Call function to refresh department table

  fetchAllDepartsmentData()
  
});

$("#locationsBtn").click(function () {
  
  // Call function to refresh location table

  fetchAllLocationsData()
  
});




// Clear modal form fields when the modal is shown
$("#createPersonnelModal").on("show.bs.modal", function (e) {
  $("#createPersonnelForm").find("input, select").val("");
});

// Handle form submission (bind only once)
$("#createPersonnelForm").on("submit", function (e) {


  e.preventDefault()
  
  let firstName = $("#personnelFirstName").val();
  let lastName = $("#personnelLastName").val();
  let jobTitle = $("#personnelJobTitle").val();
  let email = $("#personnelEmailAddress").val();
  let department = $("#createPersonnelDepartment").val();
  console.log({ firstName, lastName, jobTitle, email, department });



   $.ajax({
    url: 'server/api.php',
      method: "POST",
      data: {
        firstName: firstName,
        lastName: lastName,
        jobTitle: jobTitle,
        email: email,
        department: department, 
        action: 'createPersonnel'
      },
      success: function (response) {
        // Handle the response from the server
        console.log(response);

        alert("Personnel added successfully!");

        fetchAllPersonnelData()
        // Optionally, close the modal or reset the form here
        $("#createPersonnelForm")[0].reset(); // Reset the form fields
        $("#createPersonnelModal").modal("hide"); // Hide the modal
      },
      error: function (error) {
        console.log("Error:", error);
      }
    });
  });



// Personnel delete button 






$("#editPersonnelModal").on("show.bs.modal", function (e) {

  let dataId = $(e.relatedTarget).attr("data-id") 

  


  
  $.ajax({      
    url: "server/api.php", 
    method: "GET", 
    data: {
      action: 'fetchAllPersonnelData', 
      searchTerm: dataId, 
      id: dataId
    }, 
  
    success: function (result) {


      if (result) {
        
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editPersonnelEmployeeID").val(result.personnel[0].id);

        $("#editPersonnelFirstName").val(result.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.personnel[0].email);

        $("#editPersonnelDepartment").empty();

        $.each(result.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.department_name
            })
          );
        });

        $("#editPersonnelDepartment").val(result.personnel[0].department_id);
        
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (error) {

      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

// Executes when the form button with type="submit" is clicked

$("#editPersonnelForm").on("submit", function (e) {
  
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

 e.preventDefault()
  
  let firstName = $("#editPersonnelFirstName").val();
  let lastName = $("#editPersonnelLastName").val();
  let jobTitle = $("#editPersonnelJobTitle").val();
  let email = $("#editPersonnelEmailAddress").val();
  let department = $("#editPersonnelDepartment").val();
  let personnelID = $("#editPersonnelEmployeeID").val();
  console.log({ firstName, lastName, jobTitle, email, department });

  // AJAX call to save form data


   $.ajax({
    url: 'server/api.php',
      method: "POST",
      data: {
        firstName: firstName,
        lastName: lastName,
        jobTitle: jobTitle,
        email: email,
        department: department, 
        personnelID: personnelID, 
        action: 'editPersonnel'
      },
      success: function (response) {
        // Handle the response from the server
        console.log(response);

        alert("Personnel added successfully!");

        fetchAllPersonnelData()
        // Optionally, close the modal or reset the form here
        $("#editPersonnelForm")[0].reset(); // Reset the form fields
        $("#editPersonnelModal").modal("hide"); // Hide the modal
      },
      error: function (error) {
        console.log("Error:", error);
      }
    });
  
});


// when any delete button is clicked, pass the data-id attribute to the modal 



$("#deletePersonnelModal").on("show.bs.modal", function (e) {

  // Get the data-id attribute from the button
  let personnelId = $(e.relatedTarget).attr("data-id") ;
  let user = $(e.relatedTarget).attr("data-user")      
    
    
    
        // Set the ID in the hidden input of the modal
  $('#deletePersonnelEmployeeID').val(personnelId);
  $(this).find("#data_user").text(user)
  
    });


$("#deletePersonnelForm").on("submit", function (e) {
  
  e.preventDefault()
  
  let personnelID = $("#deletePersonnelEmployeeID").val();


  $.ajax({
    url: 'server/api.php',
      method: "POST",
      data: {
        personnelID: personnelID, 
        action: 'deletePersonnelRecord'
      },
      success: function (response) {
        // Handle the response from the server
        console.log(response);

        alert("Personnel Deleted successfully!");
        fetchAllPersonnelData()

        // Optionally, close the modal or reset the form here
        $("#editPersonnelForm")[0].reset(); // Reset the form fields
        $("#deletePersonnelModal").modal("hide"); // Hide the modal
      },
      error: function (error) {
        console.log("Error:", error);
      }
    });
})


// Department 




$("#editDepartmentModal").on("show.bs.modal", function (e) {

  let dataId = $(e.relatedTarget).attr("data-id") 
  let dataName= $(e.relatedTarget).attr("data-name") 
  let dataLocation= $(e.relatedTarget).attr("data-location") 

  
  console.log({dataId})


  
  $.ajax({      
    url: "server/api.php", 
    method: "GET", 
    data: {
      action: 'fetchAllLocationsData'
    }, 
  
    success: function (result) {


      if (result) {
        console.log({result})
        

        // return false; 


          $("#editDepartmentLocation").html("");

        
        $.each(result, function () {
  $("#editDepartmentLocation").append(
    $("<option>", {
      value: this.location_id,
      text: this.location_name,
      selected: parseInt(this.location_id)  == parseInt(dataLocation)
    })
  );
});



        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editDepartmentID").val(dataId);
        $("#editDepartmentName").val(dataName);


        
      } else {
        $("#editDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (error) {

      $("#editDepartmentModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});



$("#editDepartmentForm").on("submit", function (e) {
  
  e.preventDefault()


  let departmentName = $("#editDepartmentName").val(); 
  let departmentLocation = $("#editDepartmentLocation").val(); 
  let departmentID = $("#editDepartmentID").val(); 

  console.log({ departmentName, departmentLocation, departmentID })
  

  $.ajax({

    url: "server/api.php", 
    method: "POST", 
    data: {
      departmentName: departmentName, departmentLocation: departmentLocation, departmentID: departmentID, 
      action: 'editDepartment'
    }, 
    success: function (result) {
      if (result.success) {
        alert('Deparment edit succesfull'); 
        fetchAllDepartsmentData(); 


         $("#editDepartmentForm")[0].reset(); // Reset the form fields
        $("#editDepartmentModal").modal("hide"); // Hide the modal
      }
    }, 
    error: function (error) {
      console.log({error})
    }

  })
})









$("#deleteDepartmentModal").on("show.bs.modal", function (e) {

  // Get the data-id attribute from the button
  let departmentID = $(e.relatedTarget).attr("data-id") ;
        
    
    
    
        // Set the ID in the hidden input of the modal
  $('#deleteDepartmentID').val(departmentID);
});
    




$("#deleteDepartmentForm").on("submit", function (e) {
  
  e.preventDefault()

  console.log({ e })
  
  let departmentID = $("#deleteDepartmentID").val();


  $.ajax({
    url: 'server/api.php',
      method: "POST",
      data: {
        departmentID: departmentID, 
        action: 'deleteDepartmentRecord'
      },
      success: function (response) {
        // Handle the response from the server
        console.log(response);

        alert("Department Deleted successfully!");
        fetchAllDepartsmentData()

        // Optionally, close the modal or reset the form here
        $("#deleteDepartmentForm")[0].reset(); // Reset the form fields
        $("#deleteDepartmentModal").modal("hide"); // Hide the modal
      },
      error: function (error) {
        console.log("Error:", error);
      }
    });
})



// Location 




$("#editLocationModal").on("show.bs.modal", function (e) {
  
  
  let dataId = $(e.relatedTarget).attr("data-id") 
  let dataName = $(e.relatedTarget).attr("data-name") 

  $("#editLocationID").val(dataId); 
  $("#editLocationName").val(dataName)


  



})


$("#editLocationForm").on("submit", function (e) {
  e.preventDefault()

  let locationName = $("#editLocationName").val()
  let locationID = $("#editLocationID").val()


  console.log({ locationName, locationID })
  
  
  

  $.ajax({

    method: "POST",
    url: "server/api.php",
    data: {
      id: locationID, 
      locationName: locationName, 
      action: "editLocation"
    }, 
    success: function (result) {


      if (result.success) {
        alert('Location changed succesfully'); 
        fetchAllLocationsData()

        $("#editLocationForm")[0].reset()
        $("#editLocationModal").modal("hide")

      }
      console.log({result})
    }, 
    error: function (error) {
      console.log({error})
    }
  })

})


$("#deleteLocationModal").on("show.bs.modal", function (e) {
  
  
  let dataId = $(e.relatedTarget).attr("data-id") 
  
    $("#deleteLocationID").val(dataId); 



})





$("#deleteLocationForm").on("submit", function (e) {
  
  e.preventDefault()

  console.log({ e })
  
  let locationID= $("#deleteLocationID").val();


  $.ajax({
    url: 'server/api.php',
      method: "POST",
      data: {
        id: locationID,  
        action: 'deleteLocation'
      },
      success: function (response) {
        // Handle the response from the server
        console.log(response);

        alert("Location Deleted successfully!");
        fetchAllLocationsData()

        // Optionally, close the modal or reset the form here
        $("#deleteLocationForm")[0].reset(); // Reset the form fields
        $("#deleteLocationModal").modal("hide"); // Hide the modal
      },
      error: function (error) {
        console.log("Error:", error);
      }
    });
})



// Function to append a row using jQuery


// Function to append a row using jQuery
function appendRowToTable(data, tableSelector) {
  // Define the HTML content for the new row

  let newRow = ''; // Initialize newRow variable

  if (tableSelector === '#personnelTableBody') {
    newRow = `
      <tr>
        <td class="align-middle text-nowrap">
          ${data.firstName}, ${data.lastName}
        </td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">
          ${data.department_name}
        </td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">
          ${data.location_name}
        </td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">
          ${data.email}
        </td>
        <td class="text-end text-nowrap">
          <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
            data-bs-target="#editPersonnelModal" data-id="${data.id}" data-user="${data.firstName}, ${data.lastName}">
            <i class="fa-solid fa-pencil fa-fw"></i>
          </button>
          <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
            data-bs-target="#deletePersonnelModal" data-id="${data.id}" data-user="${data.firstName}, ${data.lastName}">
            <i class="fa-solid fa-trash fa-fw"></i>
          </button>
        </td>
      </tr>
    `;
  } else if (tableSelector === '#departmentTableBody') {
    newRow = `
      <tr>
        <td class="align-middle text-nowrap">
          ${data.department_name}
        </td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">
          ${data.location_name}
        </td>
        <td class="align-middle text-end text-nowrap">
          <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
            data-bs-target="#editDepartmentModal" data-id="${data.id}" data-name="${data.department_name}"  data-location="${data.location_id}">
            <i class="fa-solid fa-pencil fa-fw"></i>
          </button>
          <button type="button" class="btn btn-primary btn-sm" id= "deleteDepartmentBtn"  data-bs-toggle="modal"  data-bs-target="#deleteDepartmentModal"   data-id="${data.id}" data-name="${data.department_name}" data-location="${data.location_id}">
            <i class="fa-solid fa-trash fa-fw"></i>
          </button>
        </td>
      </tr>
    `;
  } else if (tableSelector === '#locationTableBody') {
    newRow = `
     <tr>
              <td class="align-middle text-nowrap">
                ${data.location_name}
              </td>
              <td class="align-middle text-end text-nowrap">
                <button type="button" class="btn btn-primary btn-sm"      data-bs-toggle="modal"
            data-bs-target="#editLocationModal" data-id="${data.location_id}" data-name="${data.location_name}"  data-location="${data.location_id}">
                  <i class="fa-solid fa-pencil fa-fw"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm"
                
                data-bs-toggle="modal"
            data-bs-target="#deleteLocationModal" data-id="${data.location_id}" data-name="${data.location_name}"  data-location="${data.location_id}"
                >
                  <i class="fa-solid fa-trash fa-fw"></i>
                </button>
              </td>
            </tr>
    `
  }
  
  // Append the new row to the specified table body using jQuery selector with '#'


  $(tableSelector).append(newRow);
}





function fetchAllPersonnelData(searchTerm = null) {
  
  
  $.ajax({
    method: "GET", 
    url: 'server/api.php',
    data: { action: 'fetchAllPersonnelData', searchTerm : searchTerm },
    success: function (data) {
      console.log({ data })
      
  $('#personnelTableBody').empty()

      data.map(dat => appendRowToTable(dat, '#personnelTableBody'))
    }, 
    error: function (err) {
      console.error(err)
    }

  })
}





function fetchAllDepartsmentData(searchTerm= null) {
  $.ajax({
    method: "GET", 
    url: 'server/api.php',
    data: { action: 'fetchAllDepartsmentData' , searchTerm : searchTerm},
    success: function (data) {
      console.log({ data })
  $('#departmentTableBody').empty()
      
      data.map(dat => appendRowToTable(dat, '#departmentTableBody'))


       $("#createPersonnelDepartment").empty();

        $.each(data, function () {
          $("#createPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.department_name
            })
          );
        });
    }, 
    error: function (err) {
      console.error(err.responseText)
    }

  })
}




function fetchAllLocationsData(searchTerm = null) {
  $.ajax({
    method: "GET", 
    url: 'server/api.php',
    data: { action: 'fetchAllLocationsData', searchTerm : searchTerm },
    success: function (data) {
      console.log({ data })
  $('#locationTableBody').empty()
      
      data.map(dat => appendRowToTable(dat, '#locationTableBody'))
    }, 
    error: function (err) {
      console.error(err.responseText)
    }

  })
}



function deletePersonnel(id) {
  

}

fetchAllPersonnelData()
fetchAllDepartsmentData()

fetchAllLocationsData()