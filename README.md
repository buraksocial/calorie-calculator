# Modern Calorie Calculator

A stylish and modern calorie calculator built with HTML, Bootstrap 5, and JavaScript. This web application allows users to calculate their daily calorie needs based on personal data and fitness goals.

## Features

- Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation
- Calculate maintenance calories based on activity level
- Calculate goal calories based on weight loss, maintenance, or weight gain goals
- Calculate macronutrient breakdown (protein, carbohydrates, and fats)
- Responsive design that works on all devices
- Modern UI with smooth animations and transitions
- Form validation for better user experience

## Usage

1. Open `index.html` in your web browser
2. Enter your personal information:
   - Gender (male/female)
   - Age (15-100 years)
   - Height (in centimeters)
   - Weight (in kilograms)
   - Activity level
   - Goal (lose weight, maintain, gain weight)
3. Click "Calculate Calories"
4. View your calculated BMR, maintenance calories, goal calories, and macronutrient breakdown
5. Click "Recalculate" to start over

## Activity Levels Explained

- **Sedentary**: Little or no exercise
- **Lightly Active**: Light exercise/sports 1-3 days/week
- **Moderately Active**: Moderate exercise/sports 3-5 days/week
- **Very Active**: Hard exercise/sports 6-7 days/week
- **Extremely Active**: Very hard exercise, physical job, or training twice a day

## How It Works

The calculator uses the Mifflin-St Jeor Equation to calculate BMR:

- For men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) + 5
- For women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) - 161

Then it multiplies the BMR by an activity factor to get maintenance calories:

- Sedentary: BMR × 1.2
- Lightly Active: BMR × 1.375
- Moderately Active: BMR × 1.55
- Very Active: BMR × 1.725
- Extremely Active: BMR × 1.9

Goal calories are calculated based on your fitness goal:

- Weight Loss: 20% calorie deficit
- Weight Maintenance: Same as maintenance calories
- Weight Gain: 15% calorie surplus

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Font Awesome
- Google Fonts (Poppins) 
