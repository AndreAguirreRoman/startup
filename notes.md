# Notes for tests

**There are many styles that can be used**

## Important git commands

````
git status
git add
git commit -am "* * Your commit message goes here * *"
git pull
git push

````

## Important MD specifications.

```
- ** Bolding ** for bolding
- _ Italics _ for italics
- ![title](url) for images
-Triple ` for creating a box
- # Heading 1 
- ## Heading 2
- ### Heading 3
- * for bullet points
- [title](link) for embedded links
```

### HTML

In this project I have learned about the following things about HTML and deploying to the server.

- **Divs**: These are types of containers or boxes you can use to organize content. They don’t affect the content themselves but help structure it in CSS or even with JS.
- **IDs**: Each ID is unique and can be assigned to any element: div, image etc. They’re useful when you want to apply styles or target that specific element in JS.
- **Inline Characteristics**: Elements like `<span>` can hold smaller pieces of content inline, unlike divs, which break things into blocks.
- **`<h1>`-`<h6>`**: These tags are used for headings, where `<h1>` is the largest and most important, and `<h6>` is the smallest.
- **`<p>`**: This tag is used for paragraphs. It's great for adding text content to your page.
- **`<ul>` & `<li>` / `<ol>`**: These tags create lists. `<ul>` creates unordered (bulleted) lists, while `<ol>` creates ordered (numbered) lists. `<li>` defines each list item.
- **`<input>`**: A form element used for different types of input fields (text boxes, checkboxes, etc.).
- **`<button>`**: This is a clickable button to trigger form submissions or actions.
- **`<img>`**: Used for embedding images. It’s self-closing, which means you don't need a closing tag. Example:
  ```html
  <img src="path/to/image.jpg" alt="description">
  ```

- **`<a>`**: This is your link tag. It’s how you can connect pages or link to other websites. Example:
  ```
  <a href="https://example.com">Click here to visit</a>
  ```

## Self-Closing Tags

Some HTML tags are self-closing, which means they don’t need a separate closing tag. `<img>`, `<input>`, and `<br>`.

## `index.html`

Naming the main page of a website as `index.html` is important because our server looks for this file by default when loading a site.


## HTML, CSS, and JavaScript

If HTML is the recipe’s ingredients, CSS is the presentation that makes it look good, and JS is the knife, mixer etc, it is used to make the ingredients work.

## Forms and Connecting Pages

Forms are how you gather input from users. You can use various input fields, buttons, and more. Here’s an example of a simple form:

```html
<form action="/submit" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name">
  <button type="submit">Submit</button>
</form>
```

`Connecting pages:`

```
<a href="about.html">About Us</a>
```

`This tag does not go in the header:)`


### 1. CSS Styling with Sass
In this project, I leveraged **Sass (Syntactically Awesome Style Sheets)** to streamline and enhance our CSS workflow. Sass allows us to use variables, nesting, and modular CSS files, making it easier to maintain and scale our styles. Key features of Sass we used include:

- **Variables**: defined reusable colors, such as `$soft-silver` and `$elegant-slate`, to maintain a consistent design language across the site.
- **Nesting**: structured our styles in a way that mimics HTML structure, making it easier to read and write hierarchical CSS without redundancy.
- **Modularization**: Breaking down the CSS into logical sections (e.g., `_colors.scss`, `_forms.scss`) allowed us to manage and import smaller pieces of code into a main Sass file, improving organization.

### 2. Handling Responsiveness and Resizing
Creating a responsive design was crucial to ensure that the site worked seamlessly across various screen sizes. Using media queries, we learned how to adjust layouts for smaller devices:

- **`@media` queries**:  implemented media queries to make the layout flexible on smaller screens (like mobile phones). For example,  reduced the font sizes and adjusted the padding and margins for better readability on screens below `670px`.
- **`min-width` property**: This property was used to prevent certain elements from shrinking beyond a specific width. It ensured that key UI elements, like the navbar and content boxes, didn't become unreadable on smaller devices.
- **Flexbox**: Flexbox made it easier to align items like the footer elements horizontally and vertically, ensuring that all elements stayed properly aligned.

### 3. Optimizing Layout for Mobile
While working on this project, we encountered challenges with layout overflow and alignment, especially on smaller devices. Using the **`overflow-x: hidden;`** CSS property, we prevented unwanted horizontal scrolling. Additionally, we adjusted the **navbar** and **footer** to be more compact on mobile by resizing text and adding better padding using **media queries**.

### 4. Using the Deployment Script
To deploy the project, we used a deployment script to simplify the process. The command used is:

```bash
./deployFiles.sh -k ~/Desktop/production.pem -h andreaguirre.click -s startup
```
To deploy the project in simon, we use a similar script, but change the startup for simon, as following:

##### Now that we have a React file, we changed the file and it is no longer deployFiles, but deployReact.
```bash
 # For the simon section 
./deployReact.sh -k ~/Desktop/production.pem -h andreaguirre.click -s simon
 # For the startup project section
./deployReact.sh -k ~/Desktop/production.pem -h andreaguirre.click -s startup
```

On this we learned the importance of exporting. There are various reasons, when we export default and we import that component into our other sections we can just use the component, if we want to import sections from that component we need to use {}

### 5. React

On react we are going to have a src folder, and 2 index files, one is going to be the html and the other one is going to be jsx, on the JSX we are just going to render the app file that is going to include all our links to the different apps, and the index.html is going to have the script that we are using so it can render all the things we want in the page.

In react it is important to use certain libraries like react-router to make the connections between apps, we have a state that we can use and hooks that are going to work with the state.

For testing we are using the vite functionality and we will use the 

```
npm run dev
```
for testing our files. React helps us solve a lot of the issues of static things from HTML making this react.

In react you can just call the component in the page, and you do not have to reuse code, you can edit those files and make them functinoal like thefollowing code:

```
<Navbar className="body__navbar" authState={authState} userName={userName} onLogout={onLogout} />
```

in this section in our navbar component we are passing the authstate to make sure that the navbar knows if it should put a login or logout

In react our components are capitalized and we always should import

````
import React from 'react';
````

### 6. Service

We learned how to call API's we need an endpoint that will help us to call the API and then call it within our components. Some of the most important things are the middleware and how we use express. We learned about CORS, and some of the code errors like the following:

Code	Text	Meaning
100	Continue	The service is working on the request
200	Success	The requested resource was found and returned as appropriate.
201	Created	The request was successful and a new resource was created.
204	No Content	The request was successful but no resource is returned.
304	Not Modified	The cached version of the resource is still valid.
307	Permanent redirect	The resource is no longer at the requested location. The new location is specified in the response location header.
308	Temporary redirect	The resource is temporarily located at a different location. The temporary location is specified in the response location header.
400	Bad request	The request was malformed or invalid.
401	Unauthorized	The request did not provide a valid authentication token.
403	Forbidden	The provided authentication token is not authorized for the resource.
404	Not found	An unknown resource was requested.
408	Request timeout	The request takes too long.
409	Conflict	The provided resource represents an out of date version of the resource.
418	I'm a teapot	The service refuses to brew coffee in a teapot.
429	Too many requests	The client is making too many requests in too short of a time period.
500	Internal server error	The server failed to properly process the request.
503	Service unavailable	The server is temporarily down. The client should try again with an exponential back off.

We also learned about the command whois that would help us find who owns certain addresses and possibly buy them.

DNS which stands for Domain Name System that is what does the magic so our website that is letters can find the correct IP address for everyone and makes life much more easy.

```
'/api': 'http://localhost:4000',
```

Added this configuration that is meant for us to be able to debug.

```
useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) =>{
            const { latitude, longitude } = position.coords;
            setLocation({latitude, longitude});
            fetchWeather(latitude, longitude);

        }, (error) => {
            setLocationError("Error retrieving location", error.message);
            setLocation(defaultLocation)
            fetchWeather(defaultLocation.latitude, defaultLocation.longitude);
        });
    }, []);

    const fetchWeather = async (latitude, longitude) => {
        try {
            const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
            if (response.ok) {
                const data = await response.json();
                setWeather(data);
            } else {
                console.error("Weather API response error:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching weather:", error.message);
        }
    };
```

This is an example of how to use our APIs we need the useEffect hook, and a function that can call and use it, we need to make the response a json since JS works with Json.


### 7. LOGIN

There are many important aspects of a database. We used many libraries that made our life easier.

Cookie Parser
Bcrypt
Express
DB

All of these were used to set the Authenticate Token, to provide the cookie for our users, and with this create a new user or login

for login we used the method post as follows: 

```
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUser(req.body.email);

    if(user) {
        const passwordMatch = await bcrypt.compare(req.body.password, user.password)
        // We are using bcrypt to "encrypt" passwords for security
        if (passwordMatch) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id, token: user.token });
      return;
    }
  } else {
    console.log('User not found:', req.body.email); // Debugging log
  }

  res.status(401).send({ msg: 'Unauthorized' });
});
```

| Status Code | Description                | Explanation                                                                     |
|-------------|----------------------------|---------------------------------------------------------------------------------|
| 100         | Continue                   | The service is working on the request.                                         |
| 200         | Success                    | The requested resource was found and returned as appropriate.                  |
| 201         | Created                    | The request was successful and a new resource was created.                     |
| 204         | No Content                 | The request was successful but no resource is returned.                        |
| 304         | Not Modified               | The cached version of the resource is still valid.                             |
| 307         | Permanent redirect         | The resource is no longer at the requested location. New location in response. |
| 308         | Temporary redirect         | The resource is temporarily at a different location. Temporary location given. |
| 400         | Bad request                | The request was malformed or invalid.                                          |
| 401         | Unauthorized               | The request did not provide a valid authentication token.                      |
| 403         | Forbidden                  | The provided authentication token is not authorized for the resource.          |
| 404         | Not found                  | An unknown resource was requested.                                             |
| 408         | Request timeout            | The request takes too long.                                                    |
| 409         | Conflict                   | The provided resource represents an outdated version of the resource.          |
| 418         | I'm a teapot               | The service refuses to brew coffee in a teapot.                                |
| 429         | Too many requests          | The client is making too many requests in too short of a time period.          |
| 500         | Internal server error      | The server failed to properly process the request.                             |
| 503         | Service unavailable        | The server is temporarily down. Try again with exponential back off.           |


With this we also learned about the secureApiRouter section of express, with this we will require authorization tokens for users in order to safeguard and limit what they can access.

We learned about Atlas MongoDB service. In order to work, we have to create a dbConfig.json since it is going to use our credentials to access our database, this should not be addeed into our gitHub.