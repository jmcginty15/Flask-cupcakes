$(async function () {
    const $cupcakeList = $('#cupcake-list');
    const $cupcakeForm = $('#add-cupcake-form');
    const $flavor = $('#flavor');
    const $size = $('#size');
    const $rating = $('#rating');
    const $image = $('#image');

    cupcakeList = await CupcakeList.getCupcakes();

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
            newCupcake = {flavor: flavor, size: size, rating: rating, image: image};
            addedCupcake = await cupcakeList.addCupcake(newCupcake);
            appendCupcakeToDOM(addedCupcake);
        }
    });

    // event listener for delete button click
    $('.delete-btn').on('click', async function (evt) {
        const $targetItem = $(evt.target).parent().parent().parent();
        const cupcakeID = $targetItem.attr('id');
        await cupcakeList.deleteCupcake(cupcakeID);
        $targetItem.remove();
    });

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
                        <button class="btn btn-danger delete-btn">Delete</button>
                    </div>
                </div>
            </li>`);

        // append to list
        $cupcakeList.append($listItem);
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