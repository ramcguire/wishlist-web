## wishlist

This is a fairly basic wishlist creating/sharing web application.

NOTE: The database needed is 'wishlist', or you need to edit it at the
beginning of server.js/init.sql to use the proper database. The init.sql provided
tried to create a database named 'wishlist', then a table named 'lists'. 

First, "npm install" in directory, and client subdirectory. Then, launch the server using "npm run dev"
Make sure there is a MySQL server running at the IP/port (or change them in server.js).

After starting the server, the main page will display a search box. It will prompt
you to enter a name, and hit enter. The search functionality is NOT case sensitive.
This is the default functionality for SQL servers. 

Two lists are populated with sample data: ryan and monica.
Enter either "ryan" or "monica" in the search bar and hit enter to see the sample
data.

If you would like to create your own list, enter your name in the search box and hit
enter. The website should prompt you to add an item to a wishlist. Your name will
not be saved in the database unless you add an item to wishlist.

For simplicity, the database is only a single table. To expand on this, a more
abstract schema could be used.

Every entry in a wishlist must have a "title" and a URL or description. This is to
allow things that aren't necessarily found on the internet. Because of this, when
rendering wishlist items, the description is not a hyperlink. A solution to this
could be a complicated regex that matches URL's to make certain entries hyperlinks,
or using an outside library from NPM. 

Each wishlist entry can be edited, or deleted from the database when viewing it.
Wishlist can be added to when selected in the search bar.