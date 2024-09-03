import Image from 'next/image';

interface BeforeAfterProps {
  beforeUrl: string;
  afterUrl: string;
  beforeAlt: string;
  afterAlt: string;
}

export default function BeforeAfter({ beforeUrl, afterUrl, beforeAlt, afterAlt }: BeforeAfterProps) {
  return (
    <section className="bg-white py-20" id="before-after">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Before & After</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-indigo-600">Before</h3>
            <div className="relative w-full aspect-square">
              <Image
                src={beforeUrl}
                alt={beforeAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-indigo-600">After</h3>
            <div className="relative w-full aspect-square">
              <Image
                src={afterUrl}
                alt={afterAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
