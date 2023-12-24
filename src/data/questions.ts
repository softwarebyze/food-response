const questions = {
  benefits: [
    `Please list three health benefits of a healthy weight.`,
    `Please list three emotional benefits of a healthy weight.`,
    `Please list three interpersonal benefits of a healthy weight.`,
    `Please list three financial benefits of a healthy weight`,

    `Please list three health benefits of a healthy diet.`,
    `Please list three emotional benefits of a healthy diet.`,
    `Please list three interpersonal benefits of a healthy diet.`,
    `Please list three financial benefits of a healthy diet.`,

    `Please list three health benefits of regular exercise.`,
    `Please list three emotional benefits of regular exercise.`,
    `Please list three interpersonal benefits of regular exercise.`,
    `Please list three financial benefits of regular exercise.`,
  ],
  costs: [
    `Please list three health problems associated with obesity.`,
    `Please list three emotional costs of obesity.`,
    `Please list three ways that obesity can negatively affect our relationships with others.`,
    `Please list three financial costs of obesity.`,

    `Please list three health problems associated with eating an unhealthy diet?`,
    `Please list three emotional costs of an unhealthy diet.`,
    `Please list three ways that eating an unhealthy diet can negatively affect our relationships with other people.`,
    `Please list three financial costs of an unhealthy diet.`,

    `Please list three health costs of a sedentary lifestyle.`,
    `Please list three emotional costs of a sedentary lifestyle.`,
    `Please list three interpersonal costs of a sedentary lifestyle.`,
    `Please list three financial costs of a sedentary lifestyle.`,
  ],
  reframing: [
    `Please replace the following negative thought with a related thought about the benefits of a healthy diet. “I have not been able to eat my daily chocolate. I am so deprived.”`,
    `Please replace the following negative thought with a related thought about the benefits of a healthy diet. “I have not treated myself to my favorite dessert for days.”`,
    `Please replace the following negative thought with a related thought about the benefits of a healthy diet. “I stopped eating potato chips at lunch to try to lose weight but I am dying to have some.”`,
    `Please replace the following negative thought with a related thought about the benefits of a healthy diet. “It has been days since I rewarded myself with a sweet treat.”`,
    `Please replace the following negative thought with a related thought about the benefits of a healthy diet. “I am really craving a pepperoni pizza—it's been a long time since I've had any.”`,
    `Please replace the following negative thought with a related thought about the benefits of exercise. “I would get so sweaty biking to school. It's too much of a hassle.”`,
    `Please replace the following negative thought with a related thought about the benefits of exercise. “I am too tired to go one that long run I had planned. I'll do it some other time.”`,
    `Please replace the following negative thought with a related thought about the benefits of exercise. “I don't have time to lift weights today. I have to study all day.”`,
  ],
  goals: [
    `What are your top three personal health goals?`,
    `What are your top three personal fitness goals?`,
  ],
  implementations: [
    `A way to help you meet your exercise and healthy diet goals is to create what we call “Intention Reminders.”
    Intention reminders are automatic responses to specific triggers that remind you of your goals. A good way to 
    create an intention reminder is in an “if-then” format. For example, if you want to reduce your sugar intake, a good 
    intention reminder could be “If I see a dessert, then I will think of how much I value having a healthy body and not 
    eat the dessert.”
    Please list below an implementation reminder for the next week.`,
  ],
  circumnavigating: [
    `How can you maintain a healthy diet when you are eating out and there are very few healthy food options and it seems to cost more?`,
    `How can you maintain a healthy diet when you have no healthy food in the house?`,
    `How can you maintain a healthy diet when you go home for the holidays and your parents have a lot of unhealthy foods around?`,
    `How can you maintain a healthy diet when it feels too difficult to plan healthy meals because of your busy schedule or limited budget?`,
    `How can you continue to exercise when you are travelling and you can't do your usual exercise routines?`,
    `How can you continue to exercise when it is raining outside?`,
    `How can you continue to exercise on days that it is very hot outside?`,
    `How can you continue to exercise when you cannot find time in your schedule?`,
    `How can you continue to exercise when you're bored with your usual exercise routine or you don't know what to do?`,
  ],
} as const

export default questions
