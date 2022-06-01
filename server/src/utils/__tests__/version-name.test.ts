import {
  inferCloneName,
  determineVersion,
  Versioning,
} from 'utils/inferCloneName';

describe('Clone utilities', function () {
  describe('inferCloneName', function () {
    it('version alphabetic', function () {
      const clonedName1 = inferCloneName('workout');
      expect(clonedName1).toBe('workout a');
      const clonedName2 = inferCloneName('test workout a');
      expect(clonedName2).toBe('test workout b');
      const clonedName3 = inferCloneName('strength');
      expect(clonedName3).toBe('strength a');
    });

    it('version numeric', function () {
      const clonedName1 = inferCloneName('arms 1');
      expect(clonedName1).toBe('arms 2');
      const clonedName2 = inferCloneName('full body 5');
      expect(clonedName2).toBe('full body 6');
    });

    it('version decimal', function () {
      const clonedName1 = inferCloneName('strength 1.0');
      expect(clonedName1).toBe('strength 1.1');
      const clonedName2 = inferCloneName('strength 3.3');
      expect(clonedName2).toBe('strength 3.4');
    });

    it('version versioned', function () {
      const clonedName1 = inferCloneName('pull v5');
      expect(clonedName1).toBe('pull v6');
    });

    it('version semantic', function () {
      const clonedName1 = inferCloneName('legs 1.0.4');
      expect(clonedName1).toBe('legs 1.0.5');
    });

    it('version alphabetic-numeric', function () {
      const clonedName1 = inferCloneName('legs abc123');
      expect(clonedName1).toBe('legs abc124');
      const clonedName2 = inferCloneName('pull a3');
      expect(clonedName2).toBe('pull a4');
    });

    it('version numeric-alphabetic', function () {
      const clonedName1 = inferCloneName('legs 1a');
      expect(clonedName1).toBe('legs 1b');
      const clonedName2 = inferCloneName('full body 2d');
      expect(clonedName2).toBe('full body 2e');
    });
  });

  describe('determineVersion', function () {
    it('returns alphabetic', function () {
      const workoutName = 'test workout';
      const version = determineVersion(workoutName);

      expect(version).toBe('alphabetic' as Versioning);
    });

    it('returns numeric', function () {
      const workoutName = 'Arms 1';
      const version = determineVersion(workoutName);

      expect(version).toBe('numeric' as Versioning);
    });

    it('returns decimal', function () {
      const workoutName = 'strength 1.0';
      const version = determineVersion(workoutName);

      expect(version).toBe('decimal' as Versioning);
    });

    it('returns versioned', function () {
      const workoutName = 'pull v5';
      const version = determineVersion(workoutName);

      expect(version).toBe('versioned' as Versioning);
    });

    it('returns semantic', function () {
      const workoutName = 'legs 1.0.4';
      const version = determineVersion(workoutName);

      expect(version).toBe('semantic' as Versioning);
    });

    it('returns alphabetic-numeric', function () {
      const workoutName = 'legs abc123';
      const version = determineVersion(workoutName);
      expect(version).toBe('alphabetic-numeric' as Versioning);
    });

    it('returns numeric-alphabetic', function () {
      const workoutName = 'legs 1a';
      const version = determineVersion(workoutName);
      expect(version).toBe('numeric-alphabetic' as Versioning);
    });
  });
});
