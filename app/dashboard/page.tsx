// app/dashboard/page.tsx
import { Upload } from '@/components/Upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Headshot Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <Upload />
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Generated Headshot</h3>
            <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">Your generated headshot will appear here</p>
              {/* Placeholder for generated image */}
              {/* <img src="/generated-headshot.jpg" alt="Generated Headshot" className="max-w-full max-h-full object-contain" /> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
