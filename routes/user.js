var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipes_utils = require("./utils/recipes_utils");

router.get("/userMessage", (req, res) => res.send("Hello, i'm in user web"));
/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/addFavoriteReciped/:recipe_id', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.params.recipe_id;
    const result = await user_utils.markAsFavorite(user_id,parseInt(recipe_id));
    res.status(200).send(result);
  } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = [];
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipeIds_array = [];
    recipes_id.map((element) => recipeIds_array.push(element.recipe_id)); //extracting the recipe ids into array
    favorite_recipes = await recipes_utils.getRecipesPreview(recipeIds_array);
    res.status(200).send(favorite_recipes);
  } catch(error){
    next(error);
  }
});

router.post('/createRecipe', async (req,res,next)=>{
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    const title = req.body.title;
    const readyInMinutes = req.body.readyInMinutes;
    const image = req.body.image;
    const popularity = req.body.popularity;
    const vegan = Number(req.body.vegan)
    const vegetarian = Number(req.body.vegetarian);
    const glutenFree = Number(req.body.glutenFree);
    const ingredients = req.body.ingredients;
    const instructions = req.body .instructions;
    const numOfDishes = req.body.numOfDishes;
    const result = await user_utils.addNewRecipe(user_id,recipe_id,title,readyInMinutes,image,popularity,vegan,vegetarian,glutenFree,ingredients,instructions,numOfDishes);
    res.status(200).send(result);
  } catch(error){
    next(error);
  }

})

router.get('/allRecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipesToReturn = await user_utils.get_all_Recipecs(user_id)
    res.status(200).send(recipesToReturn);
  } catch(error){
    next(error);
  }
});
router.get('/user_last_3_watch', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const results =  user_utils.getLast3Watch(user_id);
    const results2=await user_utils.get_user_Last3Watch(results);
    res.status(200).send(results2);
  } catch(error){
    next(error);
  }
});

router.post('/user_watched_recipe', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    // const results1 = await user_utils.Update_Table_user_indication_about_recipe(user_id,recipe_id);
    const results2 = await user_utils.Update_User_last_3_watch(user_id,recipe_id);
    res.status(200).send("The Recipe successfully update as an watched recipe");
  } catch(error){
    next(error);
  }
});

module.exports = router;
