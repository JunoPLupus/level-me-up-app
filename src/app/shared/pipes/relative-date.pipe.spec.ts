import { DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { RelativeDatePipe } from './relative-date.pipe';

// 2. Registramos o Português para o Angular reconhecer
registerLocaleData(localePt);

describe('RelativeDatePipe', () => {
  let pipe: RelativeDatePipe;

  beforeEach(() => {
    // 3. Agora podemos criar o DatePipe falando "Sou Brasileiro!"
    const datePipeDependency = new DatePipe('pt-BR');

    pipe = new RelativeDatePipe(datePipeDependency);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return string containing "Hoje" if date is today', () => {
    const today = new Date();
    const result = pipe.transform(today);
    expect(result).toContain('Hoje às');
  });

  it('should return string containing "Amanhã" if date is tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = pipe.transform(tomorrow);
    expect(result).toContain('Amanhã às');
  });

  it('should return formatted date for other dates', () => {
    // Definimos uma data qualquer no passado
    const distantDate = new Date('2025-01-25T14:00:00');
    const result = pipe.transform(distantDate);

    expect(result).not.toContain('Hoje');
    expect(result).not.toContain('Amanhã');

    // Verifica se a formatação está no padrão BR (dia/mês)
    // Esperamos algo como "25/01 às 14:00"
    expect(result).toContain('25/01');
  });

  it('should return empty string if value is null', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
