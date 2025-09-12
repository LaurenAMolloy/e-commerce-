const layout = require('../layout');

module.exports = ( { products}) => {
    //map over each product
    //return html for each product
    //join strings
    const renderedProducts = products.map((product) => {
        return `
        <div>${product.title}</div>
        `
    }).join("");

    return layout({
        content: `
        <h1 class="title">Products</h1>
        ${renderedProducts}
        `
    });
};