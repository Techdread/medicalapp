# MedicalApp Styling Guide

This document serves as the official styling guide for the MedicalApp project, ensuring visual consistency across all features and pages.

## Color Palette

### Primary Colors
- **Background Gradient**: `bg-gradient-to-br from-slate-900 to-slate-800`
- **Primary Accent**: `text-sky-400` / `bg-sky-600`
- **Card Background**: `bg-slate-800`
- **Secondary Card**: `bg-slate-700`

### Text Colors
- **Headings**: `text-sky-400` (accent) or `text-white` (primary)
- **Body Text**: `text-white` (primary) or `text-slate-300` (secondary)
- **Descriptive Text**: `text-slate-400`
- **Disclaimer Text**: `text-slate-500`
- **Placeholder Text**: `placeholder-slate-500`

### Interactive Elements
- **Button Primary**: `bg-sky-600 hover:bg-sky-700 active:bg-sky-800`
- **Button Text**: `text-white`
- **Input Background**: `bg-slate-700`
- **Input Border**: `border-slate-600`
- **Input Focus**: `focus:ring-sky-500 focus:border-sky-500`

### Status Colors
- **Error Background**: `bg-red-900`
- **Error Border**: `border-red-700`
- **Success Background**: `bg-green-900` (when needed)
- **Success Border**: `border-green-700` (when needed)

## Typography

### Font Sizes
- **Page Title**: `text-3xl font-bold`
- **Section Title**: `text-2xl font-bold`
- **Card Title**: `text-xl`
- **Body Text**: Default text size
- **Labels**: `text-lg font-semibold`
- **Disclaimer**: `text-xs`

### Text Styling
- **Prose**: `prose prose-invert max-w-none leading-relaxed` (for content areas)
- **Whitespace Handling**: `whitespace-pre-wrap` (for preserving line breaks in AI responses)

## Layout Components

### Page Container
```jsx
<div className="container mx-auto p-4 flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
  {/* Page content */}
</div>
```

### Card Structure
```jsx
<Card className="w-full max-w-2xl mt-10 bg-slate-800 border-slate-700 shadow-xl">
  <CardHeader>
    <CardTitle className="text-3xl font-bold text-center text-sky-400">Feature Title</CardTitle>
    <CardDescription className="text-center text-slate-400">
      Feature description text
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
  <CardFooter className="text-xs text-slate-500 mt-6">
    <p className="text-center w-full">
      Disclaimer text
    </p>
  </CardFooter>
</Card>
```

### Form Elements

#### Input
```jsx
<Label htmlFor="inputId" className="text-lg font-semibold text-white">Label Text</Label>
<Input
  id="inputId"
  type="text"
  className="text-lg p-4 bg-slate-700 border-slate-600 placeholder-slate-500 text-white focus:ring-sky-500 focus:border-sky-500"
  placeholder="Placeholder text"
/>
```

#### File Input
```jsx
<Label htmlFor="fileInput" className="text-lg font-semibold text-white">Upload File</Label>
<Input 
  id="fileInput" 
  type="file" 
  accept="image/png, image/jpeg, image/webp" 
  className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600/20 file:text-sky-400 hover:file:bg-sky-600/30 bg-slate-700 border-slate-600 text-white focus:ring-sky-500 focus:border-sky-500"
/>
```

#### Textarea
```jsx
<Label htmlFor="textareaId" className="text-lg font-semibold text-white">Label Text</Label>
<Textarea 
  id="textareaId"
  className="mt-2 min-h-[80px] bg-slate-700 border-slate-600 placeholder-slate-500 text-white focus:ring-sky-500 focus:border-sky-500"
  placeholder="Placeholder text"
/>
```

#### Button
```jsx
<Button 
  type="submit" 
  className="w-full text-lg p-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 transition-colors duration-150"
>
  Button Text
</Button>
```

#### Loading Button
```jsx
<Button 
  type="submit" 
  disabled={isLoading} 
  className="w-full text-lg p-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 transition-colors duration-150"
>
  {isLoading ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </>
  ) : 'Button Text'}
</Button>
```

### Alert Components

#### Error Alert
```jsx
<Alert variant="destructive" className="mt-6 bg-red-900 border-red-700 text-white">
  <Terminal className="h-5 w-5" />
  <AlertTitle className="font-semibold">Error</AlertTitle>
  <AlertDescription>{errorMessage}</AlertDescription>
</Alert>
```

### Result Cards

#### Response Card
```jsx
<Card className="mt-8 bg-slate-700 border-slate-600 shadow-lg">
  <CardHeader>
    <CardTitle className="text-xl text-sky-400">Result Title</CardTitle>
  </CardHeader>
  <CardContent className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
    <p className="whitespace-pre-wrap">{responseText}</p>
  </CardContent>
</Card>
```

## Common Patterns

### Standard Disclaimer
```jsx
<CardFooter className="text-xs text-slate-500 mt-6">
  <p className="text-center w-full">
    Disclaimer: AI-generated content is for educational purposes only and may not be fully accurate or complete. Always consult with qualified medical professionals for medical advice.
  </p>
</CardFooter>
```

### Image Container
```jsx
<div className="mt-4 border border-slate-600 rounded-lg overflow-hidden">
  <img src={imageUrl} alt="Image description" className="w-full h-auto object-contain max-h-96" />
</div>
```

## Spacing

- **Container Padding**: `p-4`
- **Card Margin Top**: `mt-10`
- **Between Form Elements**: `space-y-6`
- **Between Result Cards**: `mt-6` or `mt-8`

## Responsive Design

- **Container Max Width**: `max-w-2xl`
- **Mobile-First Approach**: Default styling works on mobile, with additional classes for larger screens when needed
- **Image Constraints**: `max-h-96` for images to ensure they don't take up too much vertical space

## Implementation Notes

1. Always use the shadcn/ui components as the foundation
2. Maintain the dark theme throughout the application
3. Use the sky blue accent color sparingly for emphasis
4. Ensure proper contrast for accessibility
5. Keep consistent spacing between elements
6. Follow the same card structure for all feature pages

This styling guide should be referenced when developing new features or making changes to existing ones to maintain a cohesive look and feel across the entire application.
