# =====================================================================
# 1. DEFINE YOUR EXACT TARGET SCHEMA
# =====================================================================
import json
import pathlib
import shutil
from pathlib import Path
from typing import Optional, List

from google import genai
from google.genai import types
from pydantic import AliasChoices, BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    google_api_key: str = Field(
        validation_alias=AliasChoices("GOOGLE_API_KEY", "GEMINI_API_KEY")
    )


class Instruction(BaseModel):
    phase: Optional[str] = Field(description="The name of the cooking phase, e.g, 'First Rise', 'Baking'")
    steps: List[str] = Field(description="Sequential steps inside of this phase")


class Ingredient(BaseModel):
    item: str
    amount: str
    unit: str
    preparation: Optional[str] = None
    alternative: Optional[str] = None


class RecipeSchema(BaseModel):
    id: str
    title: str
    cuisine: Optional[str] = None
    meal_type: Optional[str] = Field(None, description="e.g., 'Main Dish', 'Dessert', 'Appetizer'")
    tags: List[str]
    prep_time_mins: int = 0
    inactive_time_mins: int = 0
    cook_time_mins: int = 0
    total_time_mins: int = 0
    servings: int = 1
    notes: List[str]
    ingredients: List[Ingredient]
    instructions: List[Instruction]


# =====================================================================
# 2. RUN THE PIPELINE
# =====================================================================
def run_pipeline():
    # noinspection PyArgumentList
    settings = Settings()

    # Init client
    client = genai.Client(api_key=settings.google_api_key)

    # Setup directories
    input_dir = pathlib.Path("./recipe_archive/queue")
    output_dir = pathlib.Path("./recipe_archive/json")
    review_dir = pathlib.Path("./recipe_archive/review")
    completed_dir = pathlib.Path("./recipe_archive/done")

    raw_files = list(input_dir.glob("*.md")) + list(input_dir.glob("*.txt"))
    print(f"Found {len(raw_files)} recipes to process.")

    for file_path in raw_files:
        print(f"Processing: {file_path.name}")
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                raw_recipe_content = f.read()

                # Have gemini create the JSON from the raw recipe
                response = client.models.generate_content(
                    model="gemini-3.5-flash",
                    contents=f"Convert the following raw recipe into the requested JSON schema:\n\n{raw_recipe_content}",
                    config=types.GenerateContentConfig(
                        system_instruction=(
                            "You are an expert culinary data engineer.  Extract the recipe text into a structured JSON object."
                            "Break multi-state instructions into chronological 'phases'."
                            "Convert all numerical ingredient amounts into decimal/integers (e.g. '2 1/2' becomes 2.5)."
                            "Infer appropriate tags."
                        ),
                        response_mime_type="application/json",
                        response_schema=RecipeSchema,
                        temperature=0.1 # low temp for high deterministic accuracy
                    )
                )

                # The response.text is guaranteed to match Pydantic schema
                json_data = json.loads(response.text)

                # assign a deterministic clean filename based on title or original name
                clean_name = file_path.stem.lower().replace(" ", "_") + ".json"

                # save the valid json
                with open(output_dir / clean_name, "w", encoding="utf-8") as out_f:
                    json.dump(json_data, out_f, indent=2)

                # move recipe to completed
                shutil.move(file_path, completed_dir)

                print(f"Successfully converted {file_path.name}")

        except Exception as e:
            print(f"❌ Error processing {file_path.name}: {e}")
            shutil.copy(file_path, review_dir / file_path.name)
            with open(review_dir / f"{file_path.name}_error.txt", "w") as error_f:
                error_f.write(str(e))


if __name__ == "__main__":
    run_pipeline()
