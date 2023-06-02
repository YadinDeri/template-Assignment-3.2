const DButils = require("./DButils");
const recipes_utils = require("./recipes_utils");

async function markAsFavorite(user_id, recipe_id) {

    const existingFavorites = await DButils.execQuery(`SELECT recipe_ids FROM FavoriteRecipes WHERE user_id = '${user_id}'`);
    let prevlist = existingFavorites[0].recipe_ids[0].id
    let list = JSON.stringify(prevlist);
    list = JSON.parse(list)
    list.push(recipe_id)
    JSON.stringify(list)
    existingFavorites[0].recipe_ids[0].id = list
    await DButils.execQuery(`UPDATE FavoriteRecipes SET recipe_ids = '${JSON.stringify(existingFavorites[0].recipe_ids)}' WHERE user_id = '${user_id}'`);
    console.log(JSON.stringify(existingFavorites[0].recipe_ids))

}

async function getFavoriteRecipes(user_id) {
    return await DButils.execQuery(`select recipe_ids from FavoriteRecipes where user_id='${user_id}'`);
}

//------------------------------

async function Update_User_last_3_watch(user_id, recipe_id) {
    const DB_ans = await DButils.execQuery(`select * from user_last_3_watch where user_id='${user_id}'`);
    if (DB_ans.length === 0) {
        const History_Watch_R1 = recipe_id;
        const History_Watch_R2 = 0;
        const History_Watch_R3 = 0;
        Number(0);
        await DButils.execQuery(`insert into user_last_3_watch (user_id,History_Watch_R1,History_Watch_R2,History_Watch_R3) VALUES ('${user_id}', '${History_Watch_R1}', '${History_Watch_R2}','${History_Watch_R3}')`);
    } else {
        //let results=Object.values(JSON.parse(JSON.stringify(DB_ans)));
        let History_Watch_R1 = DB_ans[0].History_Watch_R1;
        let History_Watch_R2 = DB_ans[0].History_Watch_R2;
        let History_Watch_R3 = DB_ans[0].History_Watch_R3;
        History_Watch_R3 = History_Watch_R2;
        History_Watch_R2 = History_Watch_R1;
        History_Watch_R1 = recipe_id;
        console.log(History_Watch_R1);
        console.log(History_Watch_R2);
        console.log(History_Watch_R3);
        await DButils.execQuery(`update user_last_3_watch set History_Watch_R1='${History_Watch_R1}',History_Watch_R2='${History_Watch_R2}',History_Watch_R3='${History_Watch_R3}' where user_id='${user_id}'`);
    }
}

async function get_user_Last3Watch(DB_ans) {
    return DB_ans.map((row) => {
        const {
            History_Watch_R1,
            History_Watch_R2,
            History_Watch_R3
        } = row;
        return {
            History_Watch_R1: History_Watch_R1,
            History_Watch_R2: History_Watch_R2,
            History_Watch_R3: History_Watch_R3
        }
    })
}

async function get_all_Recipecs(user_id) {
    const existingRecipes = await DButils.execQuery(`SELECT recipe_ids FROM user_created_recipes WHERE user_id='${user_id}'`);
    let recipesToReturn = [];
    if (existingRecipes.length > 0) {
        const recipeIds = existingRecipes[0].recipe_ids[0].id; // Extract the recipe IDs from the JSON object
        for (const recipeId of recipeIds) {
            const recipe = await recipes_utils.getRecipeDetails(recipeId);
            recipesToReturn.push(recipe);
        }
    }
    return recipesToReturn;
}

async function addNewRecipe(user_id, recipe_id, title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree, ingredients, instructions, numOfDishes) {
    if (!Number.isInteger(user_id)) {
        user_id = parseInt(user_id);
        console.log(user_id);
        return;
    }
    await DButils.execQuery(`insert into recipes (recipe_id, title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree, ingredients, instructions, numOfDishes)
    VALUES ('${recipe_id}', '${title}', '${readyInMinutes}', '${image}', '${popularity}', '${vegan}', '${vegetarian}', '${glutenFree}', '${ingredients}', '${instructions}', '${numOfDishes}')`);

    const existingFavorites = await DButils.execQuery(`SELECT recipe_ids FROM user_created_recipes WHERE user_id = '${user_id}'`);
    let prevlist = existingFavorites[0].recipe_ids[0].id
    let list = JSON.stringify(prevlist);
    list = JSON.parse(list)
    list.push(recipe_id)
    JSON.stringify(list)
    existingFavorites[0].recipe_ids[0].id = list
    await DButils.execQuery(`UPDATE user_created_recipes SET recipe_ids = '${JSON.stringify(existingFavorites[0].recipe_ids)}' WHERE user_id = '${user_id}'`);
    //console.log(JSON.stringify(existingFavorites[0].recipe_ids))

}



//----------------------------------------------------------------------------

exports.markAsFavorite = markAsFavorite;
exports.addNewRecipe = addNewRecipe;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.get_user_Last3Watch = get_user_Last3Watch;
exports.Update_User_last_3_watch = Update_User_last_3_watch;
exports.get_all_Recipecs = get_all_Recipecs;