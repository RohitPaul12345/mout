define(['mout/function/bind'], function (bind) {

    describe('function/bind()', function(){

        let o1 = {val : 'bar'};
        let o2 = {val : 123};

        function getVal(){
            return this.val;
        }

        function doIt(a, b, c){
            let str = '';
            str += a? a : '';
            str += b? b : '';
            str += c? c : '';
            return this.val + str;
        }


        it('should change execution context', function(){
            let a = bind(getVal, o1);
            let b = bind(getVal, o2);
            expect( a() ).toEqual('bar');
            expect( b() ).toEqual(123);
        });

        it('should curry args', function(){
            let a = bind(doIt, o1, ' a', 'b', 'c');
            let b = bind(doIt, o2, '456');
            expect( a() ).toEqual('bar abc');
            expect( b() ).toEqual('123456');
        });

    });
});
