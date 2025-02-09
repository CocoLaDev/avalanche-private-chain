
import { Diplome, PerformanceNFT } from "@/interfaces/diplomes";
import Image from "next/image";

// Función de type guard
function isPerformanceNFT(item: Diplome): item is PerformanceNFT {
    return (item as PerformanceNFT).studentName !== undefined;
}

const NftsList = ({ list }: { list: Diplome[] }) => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((item, index) => (
                <div
                    key={index}
                    className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
                >
                    <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-sky-300 via-sky-600 to-sky-400"></span>
                    <div className="sm:flex sm:justify-between sm:gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                                {item.title}
                            </h3>
                            {isPerformanceNFT(item) ? (
                                <p className="text-sm text-gray-600">
                                    Étudiant: {item.studentName} - {item.studentId}
                                </p>
                            ) : (
                                // Para el NFT de programme, puedes mostrar solo el studentId u otro dato
                                <p className="text-sm text-gray-600">
                                    Étudiant: {item.studentId}
                                </p>
                            )}
                        </div>
                        <div className="hidden sm:block sm:shrink-0">
                            {item.image ? (
                                <Image
                                    alt="Diplome"
                                    src={item.image}
                                    className="size-16 rounded-lg object-cover shadow-xs"
                                    width={200}
                                    height={200}
                                />
                            ) : (
                                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-pretty text-gray-500">
                            {item.description}
                        </p>
                    </div>
                    <dl className="mt-6 flex gap-4 sm:gap-6">
                        <div className="flex flex-col-reverse">
                            <dt className="text-sm font-medium text-gray-600">{item.date}</dt>
                            <dd className="text-xs text-gray-500">Date</dd>
                        </div>
                        <div className="flex flex-col-reverse">
                            <dt className="text-sm font-medium text-gray-600">{item.location}</dt>
                            <dd className="text-xs text-gray-500">Localisation</dd>
                        </div>
                    </dl>
                    {/* Si es un NFT de performance, mostrar los cursos */}
                    {isPerformanceNFT(item) && item.courses && (
                        <div className="mt-4">
                            <h4 className="text-md font-bold text-gray-900">Cours</h4>
                            <ul>
                                {item.courses.map((course: { courseName: string; grade: string; result: string; comments: string }, idx: number) => (
                                    <li key={idx} className="text-sm text-gray-600">
                                        {course.courseName}: {course.grade} ({course.result}) - {course.comments}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NftsList;
