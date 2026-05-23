# Task 1: HTML template
Create a basic HTML template structure in the travel_recommendation.html file. It should include these tags:

<html>
<head>
<body>
Within the <head> tag include a <title> tag.
Write your website name in the <title> tag to set up the title of each web page.

# Task 2: Navbar
For this task, you need to create a navigation bar. The navbar should contain the following:

Home page link using anchor tag <a> to navigate to home page
About us page link using anchor tag <a> to navigate to about us page
Contact Us page link using anchor tag <a> to navigate to contact us page
A search bar to allow users to enter keywords to search for recommendations
A Search button to execute the search after the user clicks on it
A Reset button to clear results.

# Task 3: Home page
In this task, you will design a Home page which must include:

A background image
An introduction to this website

# Task 4: About us
In this task, you need to create an About Us page, which should include:

Information about the company
An introduction to the team members, displaying their names and their designated roles
Note: Make sure that you include the code for the navbar. The navbar on this page should only include Home, About Us, and Contact Us menu items, not the search bar and buttons.

# Task 5: Contact us
In this task, you need to create a Contact Us page, which should contain the following:

A form for users in case they want to reach out
The form should contain:
<input> boxes for name and email
<textarea> for users to write their message
Submit button to submit the form

# Task 6: Recommendation results
Now, you need to create logic in your JavaScript file to show results for your recommendations.

Note: You should check the output of your code while developing your JavaScript. Directions to view your output are on the next page of these instructions.

Fetch data from the travel_recommendation_api.json file using the fetch API method, from there you can fetch travel-related details, such as the name of the place. You need to have your own images for every imageUrl in the JSON file.

> we will need to get some images for the imageUrl field in the JSON file. You can use any images you like, but make sure to save them in the same directory as your HTML file and update the imageUrl field in the JSON file accordingly.

When a user enters a keyword in the search bar and clicks the Search button, you should filter the recommendations based on the keyword and display the results dynamically on the page. Each recommendation should include the name of the place, a brief description, and an image.

When the user clicks the Reset button, it should clear all search results and reset the search bar.

# Task 7: Keyword searches
In this task, you will write JavaScript to accept these keywords and variations the user will enter in the search field in your navigation bar on the home page.

For example, if the user enters "beach," or "beaches," "Beach" or "BEACH," then you need to write JavaScript code so that it accepts all variations of this keyword.

For uppercase letters in the keyword, you can convert them to lowercase in your JavaScript using the string manipulation toLowerCase() method.

Similarly, you need to create logic to match keywords entered for temples and countries.

The website should display results only after the user clicks the Search button.

# Task 8: Recommendations
In this task, you need to fetch the details of the places you recommend based on which keyword the user enters: beach, temple, or country.

For each of these three keywords, your results should display at least two recommendations, an image, and a description. Example screenshot is shown below.

# Task 9: Clear button
Create logic in your JavaScript file for a clear button to clear the results. To implement this feature, you can create a function that will be called after clicking on the clear button in the navbar.

# Task 10: Country date and time (optional)
In this optional task, you can create logic in your JavaScript to display the time in the country you recommend.

const options = { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };

timeZone: 'America/New_York' sets the time zone to New York. hour12: true specifies that the time should be displayed in 12-hour format (AM/PM).
hour: 'numeric', minute: 'numeric', and second: 'numeric' indicate that the hour, minute, and second components of the time should be displayed numerically.
const newYorkTime = new Date().toLocaleTimeString('en-US', options);

new Date() creates a new Date object representing the current date and time.
toLocaleTimeString('en-US', options) formats the time according to the specified options in the 'en-US' locale (English - United States) and the provided options object (options). This method returns a string representing the time in the specified format.
