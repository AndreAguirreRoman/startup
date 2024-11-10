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