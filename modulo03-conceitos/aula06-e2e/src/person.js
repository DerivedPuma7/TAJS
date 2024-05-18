export class AppError extends Error {
  constructor(message) {
    super(message);
  }
}

export class Person {
  static validate(person) {
    if(!person.name) throw new AppError('name is required');
    if(!person.cpf) throw new AppError('cpf is required');
  }

  static format(person) {
    const [name, ...lastName] = person.name.split(' ');
    return {
      cpf: person.cpf.replace(/\D/g, ''),
      name,
      lastName: lastName.join(' ')
    }
  }

  static save(person) {
    const canSave = ['cpf', 'name', 'lastName'].every(prop => person[prop]);
    if(!canSave) {
      throw new AppError(`cannot save invalid person: ${JSON.stringify(person)}`);
    }
    console.log('saving...');
  }

  static process(person) {
    this.validate(person);
    const personFormated = this.format(person);
    this.save(personFormated);
    return {
      status: 'ok',
      personFormated
    };
  }
} 

// const result = Person.process({ 
//   name: "gustavo", 
//   cpf: '111.222.333-44' 
// });

export default Person;