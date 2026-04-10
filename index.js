var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var dbName = "COLLEGE-DB";
var relName = "PROJECT-TABLE";
var connToken = "90935291|-31949238446967100|90958115";

function saveRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", data.rec_no);
}

function getProjectIdAsJsonObj() {
    var projectId = $("#projectId").val();
    return JSON.stringify({ Project_ID: projectId });
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;

    $("#projectName").val(record.Project_Name);
    $("#assignedTo").val(record.Assigned_To);
    $("#assignmentDate").val(record.Assignment_Date);
    $("#deadline").val(record.Deadline);
}

function resetForm() {
    const form = document.getElementById("projectForm");
    // if (form) form.reset();
    if (form && typeof form.reset === "function") {
    form.reset();
}

    $("#projectId").prop("disabled", false);
    $("#projectName, #assignedTo, #assignmentDate, #deadline").prop("disabled", true);

    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);

    $("#projectId").focus();
}

function enableFields() {
    $("#projectName, #assignedTo, #assignmentDate, #deadline").prop("disabled", false);
}

function validateData() {
    var projectId = $("#projectId").val();
    var projectName = $("#projectName").val();
    var assignedTo = $("#assignedTo").val();
    var assignmentDate = $("#assignmentDate").val();
    var deadline = $("#deadline").val();

    if (projectId === "") {
        alert("Project ID missing");
        $("#projectId").focus();
        return "";
    }
    if (projectName === "") {
        alert("Project Name missing");
        $("#projectName").focus();
        return "";
    }
    if (assignedTo === "") {
        alert("Assigned To missing");
        $("#assignedTo").focus();
        return "";
    }
    if (assignmentDate === "") {
        alert("Assignment Date missing");
        $("#assignmentDate").focus();
        return "";
    }
    if (deadline === "") {
        alert("Deadline missing");
        $("#deadline").focus();
        return "";
    }

    return JSON.stringify({
        Project_ID: projectId,
        Project_Name: projectName,
        Assigned_To: assignedTo,
        Assignment_Date: assignmentDate,
        Deadline: deadline
    });
}

function getProject() {
    var projectIdJsonObj = getProjectIdAsJsonObj();

    var getRequest = createGET_BY_KEYRequest(
        connToken,
        dbName,
        relName,
        projectIdJsonObj
    );

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        enableFields();
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#projectName").focus();
    } else if (resJsonObj.status === 200) {
        $("#projectId").prop("disabled", true);
        enableFields();
        fillData(resJsonObj);

        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#projectName").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") return;

    var putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relName);

    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    alert("Data saved successfully");
    resetForm();
}

function updateData() {
    var jsonChg = validateData();
    if (jsonChg === "") return;

    var updateRequest = createUPDATERecordRequest(
        connToken,
        jsonChg,
        dbName,
        relName,
        localStorage.getItem("recno")
    );

    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    alert("Data updated successfully");
    resetForm();
}

resetForm();