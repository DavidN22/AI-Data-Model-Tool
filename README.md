# AI SQL Data-Modeling tool

**AI SQL Data-Modeling tool** is a powerful tool used to data model any app or project that you have in mind. Simply talk to the AI about the type of project and once you feel comfortable with the response generate the data model and in a few seconds a visually build data-model with the help of react flow will be created.

# Key Features

<div align="center">

| Feature                                                                                                                                | Status    |
|----------------------------------------------------------------------------------------------------------------------------------------|-----------|
| Communicate with the AI model to gain insight on the project and the data-model structure                                                             | ✅        |
| Generate an visually build Data-model with the click of one button                                                               | ✅        |
| Manually create SQL tables and intergrate them with AI-made SQL tables                                                                                          | ✅        |
| Persistant History so you can update the existing model with the help of AI                                                                    | ✅        |
| (Stretch feature) Create a SQL string for the data-model so users can create the shown model in an actual database                                                           | ✅        |
| (Stretch feature) Enable local database storage to store and retrive saved data models                                                           | 🛠️        |
</div> 

## Key Features

### AI Data Model Creation
Designing your data model has never been easier. Start a conversation with the AI about your data model requirements. Once you're satisfied, hit the "Generate Data Model" button, and within seconds, your model will be fully designed and perfectly laid out

![Data Model Creation](https://raw.githubusercontent.com/DavidN22/AI-Data-Model-Tool/3c0bf6c3075dfc2b1c1b8ee495fcacc19dc17fac/frontend/src/assets/DataModelcreation.gif)



### Updating Current model with the help of AI
Not completely happy with the generated model? No problem! Continue the discussion with the AI to refine and enhance it. The AI leverages persistent history to incorporate your requested changes and update the design seamlessly.

![Datamodel Update](https://raw.githubusercontent.com/DavidN22/AI-Data-Model-Tool/3c0bf6c3075dfc2b1c1b8ee495fcacc19dc17fac/frontend/src/assets/Datamodelupdate.gif)



### Manuel Data-Model Inserts
Prefer to take matters into your own hands? Create tables manually with ease and even integrate them into AI-generated models. Alternatively, enhance AI-generated models by adding your custom tables. The process is flexible, letting you transition between manual and AI-assisted workflows effortlessly.

![Manual Mode](https://raw.githubusercontent.com/DavidN22/AI-Data-Model-Tool/3c0bf6c3075dfc2b1c1b8ee495fcacc19dc17fac/frontend/src/assets/manualmode.gif)


### Mege Manuel tables with AI + SQL string extraction
Easily design your own custom tables and integrate them with existing AI-generated models to build a comprehensive data structure. Once your tables are ready, extract the precise SQL string for any table by pressing the "SQL" button on the desired table.

![Manual Mode](https://raw.githubusercontent.com/DavidN22/AI-Data-Model-Tool/4a23fc1e45a04f2c571f263b9d8627750ab06e59/frontend/src/assets/SQLstring.gif)



## **Prerequisites**

Before setting up this project, ensure you have the following:

1. **Git**
   - Required to clone the repository and manage version control.
   - [Download Git](https://git-scm.com/downloads)

2. **Node.js and npm**
   - Required to run the application and manage dependencies.
   - [Download Node.js](https://nodejs.org/en)

3. **A Code Editor**
   - Use your preferred code editor to edit and run the project. Recommended:
     - [Visual Studio Code](https://code.visualstudio.com/)

4. **API Keys** (OpenAI and/or Gemini)
   - **OpenAI API Key** (optional):
     - Required to enable AI functionality using OpenAI's GPT models.
     - [How to get your OpenAI API Key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key)
   - **Gemini API Key (Google Generative AI)** (optional):
     - Required to enable AI functionality using Gemini's free API (15 calls per minute).
     - [Get your Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key)



## How to Verify the Setup

- **Git**: Run `git --version` in your terminal to ensure Git is installed.
- **Node.js**: Run `node --version` and `npm --version` to verify the installation.

With these prerequisites in place, you're ready to proceed with the project setup! 🚀



## Installation
1. To get started git clone the repository:

    Replace repo with the URL of the project repository.

    ```bash
    git clone https://github.com/DavidN22/AI-Data-Model-Tool.git
    ```
  


2. Navigate to the cloned repo's root directory, open it in VS Code, and install the packages. You should already be in the root directory after cloning and opening.

    ```bash
    npm install
    ```

3. Replace the API keys in `/backend/api-key.js` with your own OpenAI API key and/or Google Gemini API key.

   - **Google Gemini API Key (Free Tier)**:
     - Google Gemini offers **a completely free tier** with 15 calls per minute.
     - To get your key:
       1. Visit [Google Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key).
       2. Click **"Get a Gemini API key in Google AI Studio"**.
       3. Then, select **"Create API key"**.
       4. Copy the key and replace it in the `GeminiKey` variable in `/backend/api-key.js`.

   - **OpenAI API Key**:
     - To use OpenAI's GPT models, you'll need an OpenAI API key.
     - Visit [OpenAI API Key Settings](https://platform.openai.com/settings/organization/api-keys) to generate your key.
     - Replace the key in the `OpenAiKey` variable in `/backend/api-key.js`.

   - **Help for OpenAI Key**:
     - If you're unsure where to get your OpenAI API key, check out this guide: [OpenAI Help](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key).

---

**Note**: You can use either the OpenAI API key, the Google Gemini API key, or both, depending on your preferences. If you're starting, the **Google Gemini API key** is a great option due to its free tier!

---





4. Run your application in the root:

    ```bash
    npm start
    ```
   Visit [localhost:8000](http://localhost:8000/) to see the application and select the dropdown on which AI model you want to use!

5. Start building!


