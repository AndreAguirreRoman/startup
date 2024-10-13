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


### 1. CSS Styling with Sass
In this project, we leveraged **Sass (Syntactically Awesome Style Sheets)** to streamline and enhance our CSS workflow. Sass allows us to use variables, nesting, and modular CSS files, making it easier to maintain and scale our styles. Key features of Sass we used include:

- **Variables**: We defined reusable colors, such as `$soft-silver` and `$elegant-slate`, to maintain a consistent design language across the site.
- **Nesting**: We structured our styles in a way that mimics HTML structure, making it easier to read and write hierarchical CSS without redundancy.
- **Modularization**: Breaking down the CSS into logical sections (e.g., `_colors.scss`, `_forms.scss`) allowed us to manage and import smaller pieces of code into a main Sass file, improving organization.

### 2. Handling Responsiveness and Resizing
Creating a responsive design was crucial to ensure that the site worked seamlessly across various screen sizes. Using media queries, we learned how to adjust layouts for smaller devices:

- **`@media` queries**: We implemented media queries to make the layout flexible on smaller screens (like mobile phones). For example, we reduced the font sizes and adjusted the padding and margins for better readability on screens below `670px`.
- **`min-width` property**: This property was used to prevent certain elements from shrinking beyond a specific width. It ensured that key UI elements, like the navbar and content boxes, didn't become unreadable on smaller devices.
- **Flexbox**: Flexbox made it easier to align items like the footer elements horizontally and vertically, ensuring that all elements stayed properly aligned.

### 3. Optimizing Layout for Mobile
While working on this project, we encountered challenges with layout overflow and alignment, especially on smaller devices. Using the **`overflow-x: hidden;`** CSS property, we prevented unwanted horizontal scrolling. Additionally, we adjusted the **navbar** and **footer** to be more compact on mobile by resizing text and adding better padding using **media queries**.

### 4. Using the Deployment Script
To deploy our project, we used a deployment script to simplify the process. The command we used is as follows:

```bash
./deployFiles.sh -k ~/Desktop/production.pem -h andreaguirre.click -s startup

