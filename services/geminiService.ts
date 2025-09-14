
import { GoogleGenAI, Type } from "@google/genai";
import type { Presentation, Slide, StyledText } from '../types';

// This is a placeholder for the API key which should be set in the environment.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we can throw an error or use a mock.
  console.warn("API_KEY is not set. Using mock data.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const presentationSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A short, catchy title for the entire presentation. Max 10 words."
        },
        slides: {
            type: Type.ARRAY,
            description: "An array of 5 to 8 slide objects for the presentation.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "The title for this individual slide. Max 15 words."
                    },
                    slideType: {
                        type: Type.STRING,
                        description: "The type of slide. Use 'content' for bullet points or 'infographic' for a chart.",
                        enum: ['content', 'infographic']
                    },
                    content: {
                        type: Type.ARRAY,
                        description: "An array of strings for bullet points. Required for 'content' slides. Omit for 'infographic' slides.",
                        items: {
                            type: Type.STRING,
                        }
                    },
                    infographic: {
                        type: Type.OBJECT,
                        description: "Data for a chart. Required for 'infographic' slides. Omit for 'content' slides.",
                        properties: {
                            type: {
                                type: Type.STRING,
                                description: "The type of chart.",
                                enum: ['pie', 'bar']
                            },
                            data: {
                                type: Type.ARRAY,
                                description: "Array of data points for the chart.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        label: { type: Type.STRING, description: "Label for a data point." },
                                        value: { type: Type.NUMBER, description: "Numerical value for the data point." }
                                    },
                                    required: ["label", "value"]
                                }
                            }
                        },
                        required: ["type", "data"]
                    },
                    image_prompt: {
                        type: Type.STRING,
                        description: "A descriptive prompt for a background image that visually represents the slide's content. Be creative and specific."
                    }
                },
                required: ["title", "slideType", "image_prompt"]
            }
        }
    },
    required: ["title", "slides"]
};

const mockPresentation: Presentation = {
    title: "The Future of Renewable Energy",
    slides: [
        { id: "1", slideType: "content", title: { text: "The Dawn of a New Era", fontSize: "text-5xl", fontFamily: "font-display" }, content: [{ text: "Transitioning to sustainable power", fontSize: "text-2xl", fontFamily: "font-sans" }, { text: "Harnessing wind, solar, and geothermal", fontSize: "text-2xl", fontFamily: "font-sans" }, { text: "Global impact on climate change", fontSize: "text-2xl", fontFamily: "font-sans" }], image_prompt: "Golden sun rising over a field of solar panels and wind turbines, optimistic, dawn", imageUrl: "https://picsum.photos/seed/solardawn/1280/720" },
        { id: "2", slideType: "infographic", title: { text: "Global Energy Mix (2023)", fontSize: "text-5xl", fontFamily: "font-display" }, infographic: { type: 'pie', data: [{label: 'Fossil Fuels', value: 79}, {label: 'Nuclear', value: 9}, {label: 'Renewables', value: 12}]}, image_prompt: "Abstract globe with energy streams, data visualization style", imageUrl: "https://picsum.photos/seed/energymix/1280/720" },
        { id: "3", slideType: "content", title: { text: "Innovations in Solar Power", fontSize: "text-5xl", fontFamily: "font-display" }, content: [{ text: "Next-generation photovoltaic cells", fontSize: "text-2xl", fontFamily: "font-sans" }, { text: "Transparent solar panels for windows", fontSize: "text-2xl", fontFamily: "font-sans" }, { text: "Space-based solar farms", fontSize: "text-2xl", fontFamily: "font-sans" }], image_prompt: "Close-up of a futuristic, glowing solar panel with intricate patterns, sci-fi", imageUrl: "https://picsum.photos/seed/solarpower/1280/720" },
        { id: "4", slideType: "infographic", title: { text: "Renewable Growth (GW)", fontSize: "text-5xl", fontFamily: "font-display" }, infographic: { type: 'bar', data: [{label: '2020', value: 260}, {label: '2021', value: 295}, {label: '2022', value: 340}, {label: '2023', value: 440}]}, image_prompt: "Upward trending graph with green arrows, business, growth", imageUrl: "https://picsum.photos/seed/growth/1280/720" },
        { id: "5", slideType: "content", title: { text: "Challenges and Solutions", fontSize: "text-5xl", fontFamily: "font-display" }, content: [{ text: "Energy storage and battery tech", fontSize: "text-2xl", fontFamily: "font-sans" }, { text: "Grid modernization", fontSize: "text-2xl", fontFamily: "font-sans" }, { text: "Policy and public adoption", fontSize: "text-2xl", fontFamily: "font-sans" }], image_prompt: "A complex, glowing grid of interconnected energy nodes, abstract, technology", imageUrl: "https://picsum.photos/seed/grid/1280/720" },
    ]
};

export const generateImage = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1280/720`;
    }
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error generating image:", error);
        return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1280/720`;
    }
};

export const generatePresentationContent = async (topic: string): Promise<Presentation> => {
    if (!API_KEY) {
        return new Promise(resolve => setTimeout(() => resolve(mockPresentation), 2000));
    }

    try {
        const prompt = `Create a presentation about "${topic}". The tone should be professional and engaging. Generate between 5 and 8 slides. Include a mix of content slides with bullet points and, if the topic is suitable for data visualization, 1 to 2 infographic slides (pie or bar charts). For infographic slides, provide realistic data relevant to the topic and set slideType to 'infographic'. For content slides, provide 2 to 4 concise bullet points and set slideType to 'content'. Every slide must have a creative and specific image_prompt for its background.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: presentationSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const presentationData = JSON.parse(jsonText);

        const slidesWithStyledText = presentationData.slides.map((slide: any) => ({
            ...slide,
            title: {
                text: slide.title,
                fontSize: 'text-5xl',
                fontFamily: 'font-display',
            },
            content: slide.content ? slide.content.map((item: string): StyledText => ({
                text: item,
                fontSize: 'text-2xl',
                fontFamily: 'font-sans',
            })) : undefined,
        }));

        const slidesWithImages = await Promise.all(
            slidesWithStyledText.map(async (slide: Omit<Slide, 'id' | 'imageUrl'>, index: number) => {
                const imageUrl = await generateImage(slide.image_prompt);
                return {
                    ...slide,
                    id: `${Date.now()}-${index}`,
                    imageUrl: imageUrl,
                };
            })
        );

        const presentationWithImages: Presentation = {
            ...presentationData,
            slides: slidesWithImages,
        };
        
        return presentationWithImages;

    } catch (error) {
        console.error("Error generating presentation:", error);
        return mockPresentation;
    }
};
