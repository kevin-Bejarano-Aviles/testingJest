import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { Server } from "../../../app/server_app/server/Server";



jest.mock('../../../app/server_app/auth/Authorizer')
jest.mock('../../../app/server_app/data/ReservationsDataAccess')
jest.mock('../../../app/server_app/handlers/LoginHandler')
jest.mock('../../../app/server_app/handlers/RegisterHandler')
jest.mock('../../../app/server_app/handlers/ReservationsHandler')


const requestMock = {
    url: '',
    headers: {
        'user-agent': 'jest-test'
    }
}

const responseMock = {
    end: jest.fn(),
    writeHead: jest.fn()
}

const serverMock = {
    listen: jest.fn(),
    close: jest.fn(),
}

jest.mock('http',()=>({
    createServer: (cb:Function) => {
        cb(requestMock, responseMock)
        return serverMock;
    }
}))

describe('Server test suite', ()=>{

    let sut: Server;

    beforeEach(()=>{
        sut = new Server()
        expect(Authorizer).toBeCalledTimes(1);
        expect(ReservationsDataAccess).toBeCalledTimes(1);
    });

    afterEach(()=>{
        jest.clearAllMocks();
    });

    it('should start server on port 8080 and end the request', async()=> {
        await sut.startServer();
        
        expect(serverMock.listen).toBeCalledWith(8080);
        expect(responseMock.end).toBeCalled();
    }) 

    it('should handle register request', async()=>{
        requestMock.url = 'localhost:8080/register';
        const handleRequestSpy = jest.spyOn(RegisterHandler.prototype,'handleRequest');

        await sut.startServer();

        expect(handleRequestSpy).toBeCalledTimes(1);
        expect(RegisterHandler).toBeCalledWith(requestMock,responseMock,expect.any(Authorizer));

    })
    it('should handle login request', async()=>{
        requestMock.url = 'localhost:8080/login';
        const handleRequestSpy = jest.spyOn(LoginHandler.prototype,'handleRequest');

        await sut.startServer();

        expect(handleRequestSpy).toBeCalledTimes(1);
        expect(LoginHandler).toBeCalledWith(requestMock,responseMock,expect.any(Authorizer));
        
    })
    it('should handle reservation request', async()=>{
        requestMock.url = 'localhost:8080/reservation';
        const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype,'handleRequest');

        await sut.startServer();

        expect(handleRequestSpy).toBeCalledTimes(1);
        expect(ReservationsHandler).toBeCalledWith(requestMock,responseMock,expect.any(Authorizer),expect.any(ReservationsDataAccess));
        
    })
   /*  it('should work by now',()=>{
        sut.startServer();
    }) */
});