import { Module, customModule, Container, VStack } from '@ijstech/components';
import ScomMap from '@scom/scom-map'
@customModule
export default class Module1 extends Module {
    private mapElm: ScomMap;
    private mainStack: VStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
        this.mapElm = await ScomMap.create({
            lat: 10.797079,
            long: 106.6455165
        });
        this.mainStack.appendChild(this.mapElm);
    }

    render() {
        return <i-panel>
            <i-hstack id="mainStack" margin={{top: '1rem', left: '1rem'}} gap="2rem">
               <i-scom-map
                lat={10.774391}
                long={106.662705}
                width={500}
                height={300}
               ></i-scom-map>
            </i-hstack>
        </i-panel>
    }
}