class Person {
  static validate(person) {
    if(!person.name) throw new Error('name is required');
    if(!person.cpf) throw new Error('cpf is required');
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
      throw new Error(`cannot save invalid person: ${JSON.stringify(person)}`);
    }
    console.log('saving...');
  }

  static process(person) {
    this.validate(person);
    const personFormated = this.format(person);
    this.save(personFormated);
    return 'ok';
  }
} 

// const result = Person.process({ 
//   name: "gustavo", 
//   cpf: '111.222.333-44' 
// });

export default Person;