"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsClientes = CardsClientes;
const lucide_react_1 = require("lucide-react");
const card_1 = require("../../../components/ui/card");
function CardsClientes() {
    const peopleData = [
        { name: "Pessoa 1" },
        { name: "Pessoa 2" },
        { name: "Pessoa 3" },
    ];
    return (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {peopleData.map((person) => (<card_1.Card key={person.name} className="shadow-lg">
          <card_1.CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <lucide_react_1.User className="w-8 h-8 text-muted-foreground"/>
              </div>
            </div>
            <h3 className="text-lg font-medium text-foreground">
              {person.name}
            </h3>
          </card_1.CardContent>
        </card_1.Card>))}
    </div>);
}
