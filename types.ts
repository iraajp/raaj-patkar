
export interface User {
  name: string;
  email: string;
  picture: string;
}

export interface StyledText {
  text: string;
  fontSize: string;
  fontFamily: string;
}

export interface InfographicDataPoint {
    label: string;
    value: number;
}

export interface Infographic {
    type: 'pie' | 'bar';
    data: InfographicDataPoint[];
}

export interface Slide {
  id: string;
  title: StyledText;
  slideType: 'content' | 'infographic';
  content?: StyledText[];
  infographic?: Infographic;
  image_prompt: string;
  imageUrl: string;
}

export interface Presentation {
  title: string;
  slides: Slide[];
}
