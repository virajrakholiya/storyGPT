exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    const prompt = `Create a short story based on the following scenario: ${message}
        Please include:
        - An engaging plot
        - Character development
        - Descriptive settings
        - A clear beginning, middle, and end`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const story = response.text();

    res.status(200).json({
      success: true,
      story: story,
    });
  } catch (error) {
    console.error("Story generation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate story",
    });
  }
};
