import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ComplexMeshVisualization = ({ embeddings }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        embeddings.forEach((embedding, index) => {
            // Here you can customize the shape based on your requirement
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(0, 1);
            shape.lineTo(1, 1);
            shape.lineTo(1, 0);
            shape.lineTo(0, 0);

            const geometry = new THREE.ShapeGeometry(shape);
            const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(`hsl(${index / embeddings.length * 360}, 100%, 50%)`), side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geometry, material);

            // Position the mesh based on embedding coordinates
            mesh.position.set(embedding[0], embedding[1], 0); // Z-axis is 0 as it's a 2D shape

            scene.add(mesh);
        });

        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        // Clean up
        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [embeddings]); // Redraw the scene when embeddings change

    return <div ref={mountRef} />;
};

export default ComplexMeshVisualization;
