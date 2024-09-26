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
 
  $.ajax({      
    url: "server/api.php", 
    method: "GET", 
    data: {
      action: 'fetchAllLocationsData'
    }, 
 
    success: function (result) {
 
 
      if (result) {
 
 
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
 
 
function appendRowToPersonnelTable(data, fragment) {
 
 
  // Define the HTML content for the new row
    var row = document.createElement('tr')
 
 
 
    // changing the way row is created and added to table 
 
    var n_col = document.createElement('td')
    n_col.classList = "align-middle text-nowrap"
    var n_col_text = document.createTextNode(`${data.firstName + ' ' +  data.lastName}`)
    n_col.append(n_col_text)
    row.append(n_col)
 
 
    var department = document.createElement('td')
    department.classList = "align-middle text-nowrap d-none d-md-table-cell"
    var department_text = document.createTextNode(data.department_name)
    department.append(department_text)
    row.append(department)
 
 
 
    var location = document.createElement('td')
    location.classList = "align-middle text-nowrap d-none d-md-table-cell"
    var location_text = document.createTextNode(data.location_name)
    location.append(location_text)
    row.append(location)
    location
 
 
    var email = document.createElement('td')
    email.classList = "align-middle text-nowrap d-none d-md-table-cell"
    var email_text = document.createTextNode(data.email)
    email.append(email_text)
    row.append(email)
 
 
    var actions = document.createElement('td')
    actions.classList = "text-end text-nowrap"
 
    var editButton = document.createElement('button')
    editButton.classList = "btn btn-primary btn-sm"
    editButton.setAttribute("type", "button")
    editButton.setAttribute("data-bs-toggle", "modal")
    editButton.setAttribute("data-bs-target", "#editPersonnelModal")
 
    editButton.setAttribute("data-id", data.id)
    editButton.setAttribute("data-user", `${data.firstName + ' ' + data.lastName}`)
 
    var editIcon = document.createElement('i')
    editIcon.classList = "fa-solid fa-pencil fa-fw"
    editButton.append(editIcon)
 
 
 
 
 
 
 
 
 
 
    var deleteButton = document.createElement('button')
    deleteButton.classList = "btn btn-primary btn-sm"
    deleteButton.setAttribute("type", "button")
    deleteButton.setAttribute("data-bs-toggle", "modal")
    deleteButton.setAttribute("data-bs-target", "#deletePersonnelModal")
 
    deleteButton.setAttribute("data-id", data.id)
    deleteButton.setAttribute("data-user", `${data.firstName + ' ' +  data.lastName}`)
 
    var deleteIcon = document.createElement('i')
    deleteIcon.classList = "fa-solid fa-trash fa-fw"
    deleteButton.append(deleteIcon)
 
 
    actions.appendChild(editButton)
    actions.appendChild(deleteButton)
 
    row.append(actions)
 
 
 
 
 
 
  fragment.appendChild(row);
 
 
}
 
 
 
function appendRowToDepartmentTable(data, fragment) {
 
 
  // Define the HTML content for the new row
    var row = document.createElement('tr')
 
 
 
 
  var department_col = document.createElement('td')
    department_col.classList = "align-middle text-nowrap"
    var department_text = document.createTextNode(data.department_name)
    department_col.append(department_text)
 
    row.append(department_col)
 
    var location = document.createElement('td')
    location.classList = 'align-middle text-nowrap d-none d-md-table-cell'
    var location_text = document.createTextNode(data.location_name)
    location.append(location_text)
 
    row.append(location)
 
 
     var actions = document.createElement('td')
    actions.classList = "text-end text-nowrap"
 
    var editButton = document.createElement('button')
    editButton.classList = "btn btn-primary btn-sm"
    editButton.setAttribute("type", "button")
    editButton.setAttribute("data-bs-toggle", "modal")
    editButton.setAttribute("data-bs-target", "#editDepartmentModal")
 
    editButton.setAttribute("data-id", data.id)
    editButton.setAttribute("data-location", data.location_id)
    editButton.setAttribute("data-name", data.department_name)
    var editIcon = document.createElement('i')
    editIcon.classList = "fa-solid fa-pencil fa-fw"
    editButton.append(editIcon)
    var deleteButton = document.createElement('button')
    deleteButton.classList = "btn btn-primary btn-sm"
    deleteButton.setAttribute("type", "button")
    deleteButton.setAttribute("data-bs-toggle", "modal")
    deleteButton.setAttribute("data-id", data.id)
    deleteButton.setAttribute("data-name", data.department_name)
    deleteButton.setAttribute("data-location", data.location_id)
 
    deleteButton.setAttribute("data-bs-target", "#deleteDepartmentModal")
 
 
    var deleteIcon = document.createElement('i')
    deleteIcon.classList = "fa-solid fa-trash fa-fw"
    deleteButton.append(deleteIcon)
 
 
    actions.appendChild(editButton)
    actions.appendChild(deleteButton)
 
    row.append(actions)
 
 
 
 
  fragment.appendChild(row);
}
 
 
 
function appendRowToLocationTable(data, fragment) {
  var row = document.createElement('tr')
 
  var location = document.createElement('td')
    location.classList = 'align-middle text-nowrap'
    var location_text = document.createTextNode(data.location_name)
    location.append(location_text)
 
    row.append(location)
 
 
     var actions = document.createElement('td')
    actions.classList = "text-end text-nowrap"
 
    var editButton = document.createElement('button')
    editButton.classList = "btn btn-primary btn-sm"
    editButton.setAttribute("type", "button")
    editButton.setAttribute("data-bs-toggle", "modal")
    editButton.setAttribute("data-bs-target", "#editLocationModal")
 
    editButton.setAttribute("data-id", data.location_id)
    editButton.setAttribute("data-name", data.location_name)
 
 
    var editIcon = document.createElement('i')
    editIcon.classList = "fa-solid fa-pencil fa-fw"
    editButton.append(editIcon)
 
 
 
 
 
 
 
 
 
 
    var deleteButton = document.createElement('button')
    deleteButton.classList = "btn btn-primary btn-sm"
    deleteButton.setAttribute("type", "button")
    deleteButton.setAttribute("data-bs-toggle", "modal")
    deleteButton.setAttribute("data-id", data.location_id)
    deleteButton.setAttribute("data-name", data.location_name)
 
    deleteButton.setAttribute("data-bs-target", "#deleteLocationModal")
 
 
    var deleteIcon = document.createElement('i')
    deleteIcon.classList = "fa-solid fa-trash fa-fw"
    deleteButton.append(deleteIcon)
 
 
    actions.appendChild(editButton)
    actions.appendChild(deleteButton)
 
    row.append(actions)
 
  fragment.append(row)
 
 
}
 
 
function fetchAllPersonnelData(searchTerm = null) {
 
 
  $.ajax({
    method: "GET", 
    url: 'server/api.php',
    data: { action: 'fetchAllPersonnelData', searchTerm : searchTerm },
    success: function (data) {
      $('#personnelTableBody').empty()
 
      var fragment = document.createDocumentFragment()
 
 
      data.map(dat => appendRowToPersonnelTable(dat, fragment))
      document.getElementById("personnelTableBody").append(fragment)
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
 
      $('#departmentTableBody').empty()
      let fragment = document.createDocumentFragment()  
      data.map(dat => appendRowToDepartmentTable(dat, fragment))
 
      document.getElementById('departmentTableBody').append(fragment)
 
 
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
  $('#locationTableBody').empty()
      var fragment = document.createDocumentFragment()
 
      data.map(dat => appendRowToLocationTable(dat, fragment))
 
      document.getElementById('locationTableBody').append(fragment)
 
    }, 
    error: function (err) {
      console.error(err.responseText)
    }
 
  })
}
 
 
fetchAllPersonnelData()
fetchAllDepartsmentData()
 
fetchAllLocationsData()