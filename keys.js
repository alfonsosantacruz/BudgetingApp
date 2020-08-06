// Include in gitignore
// Only shares the format of the file
// These credentials are obtained from Google Cloud Platform when enabling Google Sheets API in your project

module.exports = {
	sheetsBudget: {
		client_id :"*******************************************.apps.googleusercontent.com",
		client_secret: "******************************",
		redirect_uris:
			[
				"http://someredirect/budgetapp",
		]
	},
};
