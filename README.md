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
| (Stretch feature) Create a SQL string for the data-model so users can create the shown model in an actual database                                                           | 🛠️        |
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




## Getting Started

**Prerequisites:**

* Git installed on your system ([https://git-scm.com/downloads](https://git-scm.com/downloads))
* Node.js and npm installed on your system ([https://nodejs.org/en](https://nodejs.org/en))
* A code editor of your choice (e.g., Visual Studio Code)
* An OpenAI API key to enable AI functionality ([https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key))


1. To get started git clone the repository:

    Replace repo with the URL of the project repository.

    ```bash
    git clone <repo>
    ```
  


2. Navigate to the root of the cloned repo and open in code editor (VS code) and install packages:

    ```bash
    npm install
    ```

3. Replace API key in `/backend/api-key.js` with your own OpenAI API key.

   If you don’t know where to get an OpenAI API key, check out this link: [OpenAI Help](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key)



4. Run your application in the root:

    ```bash
    npm start
    ```

5. Start building!

