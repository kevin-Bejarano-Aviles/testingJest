import { DataBase } from "../../../app/server_app/data/DataBase"
import * as IdGenerator from "../../../app/server_app/data/IdGenerator"

type someTypeWithId = {
    id:string,
    name: string,
    color: string
}



describe('DataBase test suite', ()=> {
    let sut: DataBase<someTypeWithId>;
    const fakeId = '1234';
    const someObject = {
        id: '',
        name: 'someName',
        color: 'Blue',
    };
    const someObject2 = {
        id: '',
        name: 'someOtherName',
        color: 'Blue',
    };
    beforeEach(()=>{
        sut = new DataBase<someTypeWithId>();
        jest.spyOn(IdGenerator,'generateRandomId').mockReturnValue(fakeId);
    });
    it('should return id after inset', async ()=>{
          const actual = await sut.insert({
            id: ''
          } as any);
          expect(actual).toBe(fakeId);
    });
    it('should get element after insert', async ()=>{
        const id = await sut.insert(someObject);
        const actual = await sut.getBy('id',id);

        expect(actual).toBe(someObject);
    });
    it('should find all elements with the same property',async()=> {
        await sut.insert(someObject);
        await sut.insert(someObject2);

        const expected = [someObject,someObject2];

        const actual = await sut.findAllBy('color','Blue');


        expect(actual).toEqual(expected);
        //? saber si lo que se obtiene es igual a lo que queres;
    });

    it('should change color on object',async()=> {
        const id = await sut.insert(someObject);

        const expectedColor = 'red'

        await sut.update(id,'color', expectedColor);

        const object = await sut.getBy('id',id);

        const actualColor = object?.color;

        expect(actualColor).toBe(expectedColor);
    });

    it('should delete object', async()=>{
        const id = await sut.insert(someObject);
        await sut.delete(id);

        const actual = await sut.getBy('id',id);

        expect(actual).toBeUndefined();
    });

    it('shouldget all elements', async()=>{
        await sut.insert(someObject);
        await sut.insert(someObject2);
        
        const expected = [someObject,someObject2];

        const actual = await sut.getAllElements();

        expect(actual).toEqual(expected);
    });
})