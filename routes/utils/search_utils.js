const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

function extractQueryParams(query,params){
    if("cuisine" in query){
        params.cuisine = query["cuisine"]
    }
    if("intolerances" in query){
        params.intolerances = query["intolerances"]
    }
    if("diet" in query){
        params.diet = query["diet"]
    }
}

async function searchForRecipes(params){
    return await axios.get(`${api_domain}/complexSearch`, {
        params
    });
}

exports.extractQueryParams = extractQueryParams;
exports.searchForRecipes = searchForRecipes;