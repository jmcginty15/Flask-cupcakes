$(async function () {
    const $cupcakeList = $('#cupcake-list');

    cupcakeList = await CupcakeList.getCupcakes();

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // populate $cupcakeList <ul>
    for (cupcake of cupcakeList.cupcakes) {
        // create <li>
        $listItem = $(`<li class="list-group-item list-item">
                <div class="row">
                    <div class="col-sm-6">
                        <img class="card-img" src="${cupcake.image}">
                    </div>
                    <div class="col-sm-6 card-body">
                        <h4 class="card-title">${capitalize(cupcake.flavor)}</h4>
                        <h6 class="card-title text-muted">${capitalize(cupcake.size)}</h6>
                        <h6 class="card-title text-muted">Rated ${cupcake.rating}/10</h6>
                    </div>
                </div>
            </li>`);
        
        // append to list
        $cupcakeList.append($listItem);
    }
});