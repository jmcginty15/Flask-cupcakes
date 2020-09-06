const BASE_URL = 'http://127.0.0.1:5000'

class CupcakeList {
    constructor(cupcakes) {
        this.cupcakes = cupcakes;
    }

    static async getCupcakes() {
        // query the /api/cupcakes endpoint
        const response = await axios.get(`${BASE_URL}/api/cupcakes`);

        // turn the plain old cupcake objects from the API into instances of the Cupcake class
        const cupcakes = response.data.cupcakes.map(cupcake => new Cupcake(cupcake));

        // build an instance of our own class using the new array of cupcakes
        const cupcakeList = new CupcakeList(cupcakes);
        return cupcakeList;
    }

    async addCupcake(newCupcake) {
        const response = await axios.post(`${BASE_URL}/api/cupcakes`, newCupcake);
        const addedCupcake = new Cupcake(response.data.cupcake);
        this.cupcakes.push(addedCupcake);
        return addedCupcake;
    }

    async deleteCupcake(cupcakeID) {
        const response = await axios.delete(`${BASE_URL}/api/cupcakes/${cupcakeID}`);
        return response.data.message;
    }

    async getCupcake(cupcakeID) {
        const response = await axios.get(`${BASE_URL}/api/cupcakes/${cupcakeID}`);
        return response.data.cupcake;
    }

    async editCupcake(cupcakeID, newCupcake) {
        const response = await axios.patch(`${BASE_URL}/api/cupcakes/${cupcakeID}`, newCupcake);
        return response.data.cupcake;
    }
}

class Cupcake {
    constructor(cupcakeObj) {
        this.id = cupcakeObj.id;
        this.flavor = cupcakeObj.flavor;
        this.size = cupcakeObj.size;
        this.rating = cupcakeObj.rating;
        this.image = cupcakeObj.image;
    }
}