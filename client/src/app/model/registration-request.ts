export class FarmerRequest {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    bPlace: string;
    date: string;
    id: number;
}

export class CompanyRequest {
    companyName: string;
    username: string;
    password: string;
    email: string;
    ePlace: string;
    date: string;
    id: number;
}

export class User {
    fullName: string;
    username: string;
    password: string;
    email: string;
    place: string;
    phone: string;
    date: string;
    userType: string;
}

export function makeUserFromCompanyRequest(request: CompanyRequest): User {
    return {
        fullName: request.companyName,
        username: request.username,
        password: request.password,
        email: request.email,
        place: request.ePlace,
        date: request.date,
        phone: null,
        userType: 'company'
    };
}

export function makeUserFromFarmerRequest(request: FarmerRequest): User {
    return {
        fullName: `${request.firstName} ${request.lastName}`,
        username: request.username,
        password: request.password,
        email: request.email,
        place: request.bPlace,
        phone: request.phone,
        date: request.date,
        userType: 'farmer'
    };
}