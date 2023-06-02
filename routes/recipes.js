var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/recipeMessage", (req, res) => res.send("Hello, i'm in recipes web"));

router.get("/random3recipes",async (req,res,next)=>{
  try{
    let random_3_recipes = await recipes_utils.getRandomThreeRecipes();
    res.send(random_3_recipes);
  } catch(error){
    next(error);
  }
});
/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipe_id", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipe_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
