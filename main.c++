#include <GL/glut.h>

void display() {
    glClear(GL_COLOR_BUFFER_BIT);

    glPushMatrix();
    glRotatef(45, 0, 0, 1);   // زاوية دوران 45 درجة
    glColor3f(1.0, 0.5, 0.0); // اللون برتقالي
    glBegin(GL_TRIANGLES);
        glVertex2f(0, 2);
        glVertex2f(-2, -2);
        glVertex2f(2, -2);
    glEnd();
    glPopMatrix();

    glFlush();
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowSize(500, 500);
    glutCreateWindow("Rotation + Colors + Size");

    glClearColor(0, 0, 0, 1);    // خلفية سوداء
    glMatrixMode(GL_PROJECTION);
    gluOrtho2D(-5, 5, -5, 5);    // تكبير مساحة العرض
    glutDisplayFunc(display);
    glutMainLoop();
    return 0;
}