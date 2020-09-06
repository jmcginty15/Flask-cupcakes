$(async function () {
    const $cupcakeList = $('#cupcake-list');
    const $cupcakeForm = $('#add-cupcake-form');
    const $flavor = $('#flavor');
    const $size = $('#size');
    const $rating = $('#rating');
    const $image = $('#image');

    const cupcakeList = await CupcakeList.getCupcakes();

    // populate $cupcakeList <ul>
    for (cupcake of cupcakeList.cupcakes) {
        appendCupcakeToDOM(cupcake);
    }

    // event listener for form submission
    $cupcakeForm.on('submit', async function (evt) {
        evt.preventDefault();
        $('.error-message').remove();
        let ratingValidated = true;
        let imageValidated = true;
        const flavor = $flavor.val();
        const size = $size.val();
        const rating = parseInt($rating.val());
        const image = $image.val();

        if (!rating || rating < 0 || rating > 10) {
            const $message = $('<small class="form-text text-muted error-message">Please enter a rating between 0 and 10</small>');
            $rating.parent().append($message);
            ratingValidated = false;
        }
        if (image && !isURL(image)) {
            const $message = $('<small class="form-text text-muted error-message">Please enter a valid URL</small>');
            $image.parent().append($message);
            imageValidated = false;
        }

        if (ratingValidated && imageValidated) {
            $('.form-control').val('');
            newCupcake = { flavor: flavor, size: size, rating: rating, image: image };
            addedCupcake = await cupcakeList.addCupcake(newCupcake);
            appendCupcakeToDOM(addedCupcake);
        }
    });

    // event listener for button clicks
    $('li').on('click', async function (evt) {
        if (evt.target.classList.contains('cancel-edit')) {
            cancelEdit(evt);
        } else if (evt.target.classList.contains('submit-edit-form')) {
            submitEditForm(evt);
        } else if (evt.target.classList.contains('edit-btn')) {
            showEditForm(evt);
        } else if (evt.target.classList.contains('delete-btn')) {
            deleteCupcake(evt);
        }
    });

    // function for edit button click
    async function showEditForm(evt) {
        const $targetItem = $(evt.target).parent().parent().parent();
        const cupcakeID = $targetItem.attr('id');
        cupcake = await cupcakeList.getCupcake(cupcakeID);
        appendEditForm(cupcake);
    }

    // function for submit edit button click
    async function submitEditForm(evt) {
        const $targetItem = $(evt.target).parent().parent().parent();
        const cupcakeID = $targetItem.attr('id');
        $(`.error-message-${cupcakeID}`).remove();
        let flavorValidated = true;
        let sizeValidated = true;
        let ratingValidated = true;
        let imageValidated = true;
        const flavor = $(`#flavor-${cupcakeID}`).val();
        const size = $(`#size-${cupcakeID}`).val();
        const rating = parseInt($(`#rating-${cupcakeID}`).val());
        const image = $(`#image-${cupcakeID}`).val();

        if (!flavor) {
            const $message = $(`<small class="form-text text-muted error-message-${cupcakeID}">Please enter a flavor</small>`);
            $(`#flavor-${cupcakeID}`).parent().append($message);
            flavorValidated = false;
        }
        if (!size) {
            const $message = $(`<small class="form-text text-muted error-message-${cupcakeID}">Please enter a size</small>`);
            $(`#size-${cupcakeID}`).parent().append($message);
            sizeValidated = false;
        }
        if (!rating || rating < 0 || rating > 10) {
            const $message = $(`<small class="form-text text-muted error-message-${cupcakeID}">Please enter a rating between 0 and 10</small>`);
            $(`#rating-${cupcakeID}`).parent().append($message);
            ratingValidated = false;
        }
        if (image && !isURL(image)) {
            const $message = $(`<small class="form-text text-muted error-message-${cupcakeID}">Please enter a valid URL</small>`);
            $(`#image-${cupcakeID}`).parent().append($message);
            imageValidated = false;
        }

        if (flavorValidated && sizeValidated && ratingValidated && imageValidated) {
            newCupcake = { flavor: flavor, size: size, rating: rating, image: image };
            editedCupcake = await cupcakeList.editCupcake(cupcakeID, newCupcake);
            $targetItem.empty();
            fillListItem(editedCupcake);
        }
    }

    // function for cancel edit button click
    async function cancelEdit(evt) {
        const $targetItem = $(evt.target).parent().parent().parent();
        const cupcakeID = $targetItem.attr('id');
        cupcake = await cupcakeList.getCupcake(cupcakeID);
        $targetItem.empty();
        fillListItem(cupcake);
    }

    // function for delete button click
    async function deleteCupcake(evt) {
        const $targetItem = $(evt.target).parent().parent().parent();
        const cupcakeID = $targetItem.attr('id');
        await cupcakeList.deleteCupcake(cupcakeID);
        $targetItem.remove();
    }

    function appendCupcakeToDOM(cupcake) {
        // create <li>
        const $listItem = $(`<li id="${cupcake.id}" class="list-group-item list-item">
                <div class="row">
                    <div class="col-sm-6">
                        <img class="card-img" src="${cupcake.image}">
                    </div>
                    <div class="col-sm-6 card-body">
                        <h4 class="card-title">${capitalize(cupcake.flavor)}</h4>
                        <h6 class="card-title text-muted">${capitalize(cupcake.size)}</h6>
                        <h6 class="card-title text-muted">Rated ${cupcake.rating}/10</h6>
                        <button class="btn btn-primary edit-btn">Edit</button>
                        <button class="btn btn-danger delete-btn">Delete</button>
                    </div>
                </div>
            </li>`);

        // append to list
        $cupcakeList.append($listItem);
    }

    function fillListItem(cupcake) {
        const $listItem = $(`#${cupcake.id}`);
        const $listItemContent = $(`<div class="row">
            <div class="col-sm-6">
                <img class="card-img" src="${cupcake.image}">
            </div>
            <div class="col-sm-6 card-body">
                <h4 class="card-title">${capitalize(cupcake.flavor)}</h4>
                <h6 class="card-title text-muted">${capitalize(cupcake.size)}</h6>
                <h6 class="card-title text-muted">Rated ${cupcake.rating}/10</h6>
                <button class="btn btn-primary edit-btn">Edit</button>
                <button class="btn btn-danger delete-btn">Delete</button>
            </div>
        </div>`);
        $listItem.append($listItemContent);
    }

    function appendEditForm(cupcake) {
        // create form
        const $targetItem = $(`#${cupcake.id}`);
        const $editForm = $(`<div class="list-group-item card-body">
            <h4 class="card-title">Edit cupcake:</h4>
            <h6 class="asterisk"><small>* denotes required fields</small></h6>
            <form class="card-body edit-cupcake-form">
                <div class="form-group">
                    <label for="flavor-${cupcake.id}">Flavor</label> <b class="asterisk">*</b>
                    <input class="form-control" id="flavor-${cupcake.id}" name="flavor-${cupcake.id}" required type="text" value="${cupcake.flavor}">
                </div>
                <div class="form-group">
                    <label for="size-${cupcake.id}">Size</label> <b class="asterisk">*</b>
                    <input class="form-control" id="size-${cupcake.id}" name="size-${cupcake.id}" required type="text" value="${cupcake.size}">
                </div>
                <div class="form-group">
                    <label for="rating-${cupcake.id}">Rating</label> <b class="asterisk">*</b>
                    <input class="form-control" id="rating-${cupcake.id}" name="rating-${cupcake.id}" required type="text" value="${cupcake.rating}">
                </div>
                <div class="form-group">
                    <label for="image-${cupcake.id}">Image URL</label>
                    <input class="form-control" id="image-${cupcake.id}" name="image-${cupcake.id}" type="text" value="${cupcake.image}">
                </div>
                <a class="btn btn-primary submit-edit-form" style="color: white;">Submit</a>
                <a class="btn btn-danger cancel-edit" style="color: white;">Cancel</a>
            </form>
        </div>`);
        $targetItem.empty();
        $targetItem.append($editForm);
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // function to test for valid url
    // found on StackOverflow at https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    function isURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }
});