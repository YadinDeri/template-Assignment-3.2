var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

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
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
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
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
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
    const instructions = req.body.instructions;
    const numOfDishes = req.body.numOfDishes;
    await user_utils.addNewRecipe(user_id,recipe_id,title,readyInMinutes,image,popularity,vegan,vegetarian,glutenFree,ingredients,instructions,numOfDishes);
    res.status(200).send("The Recipe successfully added");
  } catch(error){
    next(error);
  }

})




module.exports = router;
