'use strict';

// Get the element after the page loaded completely.
// URL: https://stackoverflow.com/questions/66701770/document-getelementsbyclassname-returning-undefined-despite-having-that-class-in
window.onload = () => {

    // For bootstrap button, register the EventListener
    // URL: https://smartdevpreneur.com/the-complete-guide-to-bootstrap-button-click-events/#:~:text=Bootstrap%20Buttons%20have%20an%20onClick,using%20a%20react%2Dbootstrap%20Button!
    document.getElementById("submitButtonId").addEventListener("click", requestSubmit);

    let submitButton = document.getElementById("submitButtonId");
    let loadingButton = document.getElementById("submitLoadingId");

};


// Submit the request in "Contact"
function requestSubmit(failed){

    // Original Validation:
    let failed_after = originalInquiryValidation();

    // If Form is invalid, the process to fetch API is stopped.
    if(failed || failed_after){
        return;
    }

    let submitButton = document.getElementById("submitButtonId");
    let loadingButton = document.getElementById("submitLoadingId");

    // Display the KuruKuru
    submitButton.classList.add("visually-hidden");
    loadingButton.classList.remove("visually-hidden");

    /*
    Form from HTML to JSON
    URL:
    https://qiita.com/tanakanata7190/items/3f2faf2848cc2de0cf8c
     */
    let myFormData = $("#contactFormId").serializeArray();
    let myForm = $("#contactFormId");
    let data = parseJson(myForm);
    console.log("---data (JSON)---");
    console.log(data);

    // Use "Lambda Function URL" for API
    const url = "https://dt4cwop4ksfvgukdfiha53y6oq0ryoig.lambda-url.ap-northeast-1.on.aws/"
    fetch(
        // Send Form to Lambda
        url, {
            method: 'POST',
            // mode: 'no-cors',
            mode: 'cors',
            referrerPolicy: 'no-referrer',
            redirect: 'follow',
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded'
                // 'Content-Type': 'multipart/form-data'
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    )
        .then((response) => {
            // Redirect to Thank you page
            let redirectUrl = "/bex-survey/contact/thankyou.html";
            console.log(response.json());
            window.location.href = redirectUrl;

        })
        .catch((error) => {
            // error.redirect("https://www.google.co.jp");
            console.log("Error::: " + error);
            console.log("Error-text::: " + error.text);

            let errorUrl = "/bex-survey/contact/error.html";
            window.location.href = errorUrl;

        })
        .finally(() => {
            // window.alert("finally");
            // KuruKuru is gone submitButton.classList.remove("visually-hidden");
            loadingButton.classList.add("visually-hidden");
        });


}

/**
 * Inquiry Original Validation
 *
 * @returns {boolean}
 */
function originalInquiryValidation(){

    let failed = false;

    // Email Address == Email Address Confirm
    if($('emailId').val!==$('emailConfirmId').val){
        failed = true;
        $('emailConfirmDivId').removeClass("visually-hidden");
    }

    // Tel Number is correct?
    const regex = /\+?\d-?\d-?\d-?\d/
    if(regex.test($('#telId').val)){
        failed = true;
        $('telDivId').removeClass("visually-hidden");
    }

    return failed;

}

/**
 * Use Bootstrap Validation for multiple checkboxes check
 * URL: https://itecnote.com/tecnote/javascript-how-to-group-checkboxes-for-validation-in-bootstrap/
 */
window.addEventListener('load', function () {
// window.alert("--------------SUBMIT CHUUU------");
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
    let interestlist = "";
    let checkedValue = $("[type='checkbox']:checked").val();
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {

            let failed = false;
            let checkboxFailed = false;

            if($("[type='checkbox']:checked").length == 0){
                $("[type='checkbox']").attr('required', true);
                failed = true;
                checkboxFailed = true;
                // Added for Validation Message
                $('#interestValidationId').attr('required', true);
                $('#interestValidationId').addClass('is-invalid');
            } else {
                $("[type='checkbox']").attr('required', false);
                // Added to remove Validation Message
                $('#interestValidationId').attr('required', false);
                $('#interestValidationId').removeClass('is-invalid');

                // Add interest product
                // interestlist = interestlist + ", " + $("[type='checkbox']").val();
                interestlist = checkedValue;
            }

            if (form.checkValidity() === false) {
                failed = true;
            }

            if (failed == true) {
                event.preventDefault();
                event.stopPropagation();
            } else {
            }
            // Fetch API for POST
            requestSubmit(failed);

            form.classList.add('was-validated');

            // Prevent the default form submit
            event.preventDefault();

        }, false);
    });

    // Add the interest product list to Form input
    // $('.needs-validation').append('<input type="hidden" name="interest" id="interestId">')
    // $("#interestId").val(interestlist);


}, false);

/**
 * Change data to suitable JSON
 *
 * @param data
 * @returns {{}}
 */
function parseJson(data) {
    let returnJson = {};
    /*
    for (var idx = 0; idx < data.length; idx++){
        returnJson[data[idx].name] = data[idx].value
    }
    return returnJson;
     */
    // let interest = [];
    let interest = "";
    let fs = document.querySelectorAll("input,select,textarea");
    Array.prototype.forEach.call(fs,function(e) {

        if(e.type=="radio"){
            if(e.checked) {
                returnJson[e.name] = e.value;
            } else if(returnJson[e.name]==undefined) {
                returnJson[e.name] = null;
            }
        } else if(e.type=="checkbox") {
            if(e.checked==true) {
                if (!returnJson[e.name]) {
                    // returnJson[e.name] = [];
                    interest = e.value;
                    returnJson[e.name] = interest;
                } else {
                    interest = interest + ", " + e.value;
                    returnJson[e.name] = interest;
                }
            }
        } else {
            returnJson[e.name] = e.value;
        }
    });
    return returnJson;
}

