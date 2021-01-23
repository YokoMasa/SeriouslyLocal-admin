export default async function(context) {
    const apiKey = window.sessionStorage.getItem("api_key");
    if (apiKey) {
        await context.$api.category.list().catch(err => {
            window.sessionStorage.removeItem("api_key");
            context.redirect("/login");
        });
    } else {
        if (context.route.fullPath !== "/login") {
            context.redirect("/login");
        }
    }
}