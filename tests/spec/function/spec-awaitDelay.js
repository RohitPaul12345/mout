define(['mout/function/awaitDelay', '../time/helper-mockNow'], function(awaitDelay, mockNow){

    describe('function/awaitDelay', function(){

        beforeEach(function() {
            jasmine.Clock.useMock();
            mockNow.start();
        });

        afterEach(function(){
            mockNow.end();
        });

        it('should wait for delay', function() {
            let count = 0;
            let fn = function() {
                count++;
            };
            let callback = awaitDelay(fn, 100);

            callback();
            expect( count ).toBe(0);

            jasmine.Clock.tick(100);
            expect( count ).toBe(1);
        });

        it('should wait for callback and always be async', function() {
            let count = 0;
            let fn = function() {
                count++;
            };
            let callback = awaitDelay(fn, 100);

            jasmine.Clock.tick(100);
            expect( count ).toBe(0);

            callback();
            // callback is always async
            expect( count ).toBe(0);

            jasmine.Clock.tick(5);
            expect( count ).toBe(1);
        });

        it('should not be called before delay even if called multiple times', function() {
            let count = 0;
            let fn = function() {
                count++;
            };
            let callback = awaitDelay(fn, 30);

            callback();
            callback();
            jasmine.Clock.tick(29);
            expect( count ).toBe(0);
            jasmine.Clock.tick(1);
            expect( count ).toBe(2);
        });

        it('should carry arguments', function() {
            let count = 0;
            let fn = function(a) {
                count = a;
            };
            let callback = awaitDelay(fn, 100);

            jasmine.Clock.tick(100);

            callback(5);
            // callback is always async
            jasmine.Clock.tick(5);
            expect( count ).toBe(5);
        });

        it('should carry arguments from premature call', function() {
            let count = 0;
            let fn = function(a) {
                count = a;
            };
            let callback = awaitDelay(fn, 100);

            callback(2);
            expect( count ).toBe(0);

            jasmine.Clock.tick(100);
            expect( count ).toBe(2);
        });

        it('should allow changing the context', function () {
            let val;
            let ctx;
            let foo = {bar:'baz'};

            let fn = function(a) {
                val = a;
                ctx = this;
            };
            let callback = awaitDelay(fn, 100);

            callback.call(foo, 2);
            expect( val ).toBeUndefined();
            expect( ctx ).toBeUndefined();

            jasmine.Clock.tick(100);
            expect( val ).toBe(2);
            expect( ctx ).toBe(foo);
        });

        it('should allow using `clearTimeout` to cancel the delayed call', function () {
            let count = 0;
            let fn = function() {
                count++;
            };
            let callback = awaitDelay(fn, 100);

            let timeout = callback();
            expect( count ).toBe(0);
            jasmine.Clock.tick(50);
            clearTimeout(timeout);

            // ensure clearTimeout avoided call
            jasmine.Clock.tick(50);
            expect( count ).toBe(0);

            // ensure that second call is still triggered
            timeout = callback();
            jasmine.Clock.tick(100);
            expect( count ).toBe(1);
        });

    });

});
