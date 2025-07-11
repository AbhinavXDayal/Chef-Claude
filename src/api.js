import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.`

const token = import.meta.env.VITE_HF_ACCESS_TOKEN
console.log("Token available:", !!token)
console.log("Token starts with:", token ? token.substring(0, 10) + "..." : "No token")

const hf = new HfInference(token)

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
    try {
        const prompt = `${SYSTEM_PROMPT}\n\nUser: I have ${ingredientsString}. Please give me a recipe you'd recommend I make!\n\nAssistant:`
        
        const response = await hf.textGeneration({
            model: "gpt2",
            inputs: prompt,
            parameters: {
                max_new_tokens: 1024,
                temperature: 0.7,
                do_sample: true
            }
        })
        return response.generated_text
    } catch (err) {
        console.error("Error generating recipe:", err.message)
        return "Sorry, something went wrong while fetching the recipe."
    }
}
