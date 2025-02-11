export interface ProgrammeNFT {
    tokenId: number;
    title: string;
    description: string;
    location: string;
    date: string;
    image: string;
    studentId: string;
    Program: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "Academic Progress": any[];
    programStatus: {
        status: string;
        certificateIssuedDate: string;
        comments: string;
    };
    ipfsCID: string;
    issuer: string;
    signer: string;
}

export interface PerformanceNFT {
    tokenId: number;
    title: string;
    description: string;
    location: string;
    date: string;
    image: string;
    studentId: string;
    studentName: string;
    academicStatus: {
        status: string;
        comments: string;
    }
    courses: {
        courseName: string;
        grade: string;
        result: string;
        comments: string;
    }[];
    yearStartDate: string;
    yearEndDate: string;
    ipfsCID: string;
    issuer: string;
    signer: string;
}

export type Diplome = ProgrammeNFT | PerformanceNFT;
